// Installation is a user gesture. A manual route remains available when the browser supplies no native prompt.
(() => {
  const entry = document.querySelector('[data-tawfeer-install]');
  if (!entry) return;

  const standalone = window.matchMedia('(display-mode: standalone)');
  const external = window.top !== window.self || !/^https?:$/.test(location.protocol) || !window.isSecureContext;
  let promptEvent = null;
  let installed = false;
  const runningAsApp = () => installed || standalone.matches || navigator.standalone === true;

  function syncButton() {
    entry.hidden = runningAsApp();
    const native = document.querySelector('[data-tawfeer-native]');
    if (native) native.hidden = !promptEvent || external || runningAsApp();
  }

  function deviceInstructions() {
    const agent = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(agent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) return ['على iPhone وiPad', [
      'افتح رابط توفير في Safari، ثم اضغط «مشاركة».',
      'اختر «إضافة إلى الشاشة الرئيسية». إذا ظهر خيار «فتح كتطبيق ويب»، فعّله.',
      'اضغط «إضافة» لتظهر أيقونة توفير على جهازك.'
    ]];
    if (/SamsungBrowser/i.test(agent)) return ['في متصفح Samsung Internet', [
      'اضغط رمز التثبيت في شريط العنوان.',
      'أكّد الإضافة، ثم افتح توفير من أيقونته.'
    ]];
    if (/Android/i.test(agent)) return ['على Android', [
      'افتح توفير في Chrome، ثم افتح قائمة النقاط الثلاث.',
      'اختر «تثبيت التطبيق»، أو «التثبيت وإنشاء اختصار» ثم «تثبيت». في بعض الإصدارات يظهر الخيار باسم «إضافة إلى الشاشة الرئيسية».'
    ]];
    if (/Macintosh|Mac OS X/i.test(agent) && /Safari/i.test(agent) && !/Chrome|Chromium|Edg|Firefox/i.test(agent)) return ['في Safari على Mac', [
      'على macOS Sonoma 14 أو أحدث، افتح قائمة «ملف» أو زر «مشاركة».',
      'اختر «إضافة إلى شريط الأيقونات» ثم «إضافة».'
    ]];
    if (/Edg\//i.test(agent)) return ['في Microsoft Edge', [
      'اضغط رمز تثبيت التطبيق في شريط العنوان إذا ظهر.',
      'أو افتح قائمة المتصفح، ثم «المزيد من الأدوات» و«التطبيقات» واختر تثبيت هذا الموقع كتطبيق.'
    ]];
    if (/Chrome|Chromium/i.test(agent)) return ['في Chrome على الكمبيوتر', [
      'اضغط رمز التثبيت في شريط العنوان.',
      'أو من قائمة النقاط الثلاث اختر «بثّ وحفظ ومشاركة»، ثم «تثبيت الصفحة كتطبيق».'
    ]];
    return ['على هذا الجهاز', ['يمكنك استخدام توفير مباشرة من الرابط. لتثبيته، افتح الرابط في Chrome أو Edge، أو في Safari على أجهزة Apple.']];
  }

  function showGuide() {
    if (runningAsApp()) return;
    const [heading, steps] = deviceInstructions();
    const body = external
      ? '<p>افتح رابط توفير في نافذة المتصفح على جهازك، ثم اختر تثبيت التطبيق.</p><a class="btn" href="' + KOD_CONFIG.publicAppUrl + '?install=1" target="_blank" rel="noopener">فتح رابط توفير</a>'
      : '<h3>' + heading + '</h3><ol>' + steps.map(step => '<li>' + step + '</li>').join('') +
        '</ol><button class="btn" type="button" data-tawfeer-native hidden>تثبيت على هذا الجهاز</button>';
    showModal('<div class="modal-body tawfeer-install-guide"><img src="./tawfeer-logo.png" alt="توفير" width="112"><h2 id="modal-title">تثبيت توفير</h2>' +
      body + '</div>');
    syncButton();
  }

  async function requestInstall() {
    if (runningAsApp()) return;
    if (!promptEvent || external) { showGuide(); return; }
    const event = promptEvent;
    promptEvent = null;
    syncButton();
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === 'accepted' && document.querySelector('.tawfeer-install-guide')) closeModal();
    } catch {
      if (!document.querySelector('.tawfeer-install-guide')) showGuide();
    }
  }

  window.addEventListener('beforeinstallprompt', event => {
    if (external || runningAsApp()) return;
    event.preventDefault();
    promptEvent = event;
    syncButton();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    promptEvent = null;
    if (document.querySelector('.tawfeer-install-guide')) closeModal();
    syncButton();
  });
  standalone.addEventListener?.('change', syncButton);
  entry.addEventListener('click', requestInstall);
  document.addEventListener('click', event => {
    if (event.target.closest('[data-tawfeer-native]')) requestInstall();
  });
  syncButton();

  if (!external && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', {scope: './', updateViaCache: 'none'}).catch(() => {
      // A restricted browser can still open the website and use its own installation menu.
    });
  }
  const params = new URLSearchParams(location.search);
  if (params.get('install') === '1' && (!location.hash || location.hash === '#discover') && !runningAsApp()) showGuide();
})();
