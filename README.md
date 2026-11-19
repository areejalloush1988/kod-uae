# KOD UAE

Arabic RTL food ordering app for restaurants, cafés and cafeterias in the UAE. The searchable nationwide directory uses a local OpenStreetMap snapshot. A second index links named branches to official sources, and published dining offers link to operator terms. The homepage opens the order storefront. Customers use a native menu, cart, delivery or pickup, checkout, receipt and order tracking at participating restaurants.

Live app: https://areejalloush1988.github.io/kod-uae/

## Deployment

GitHub Pages serves `index.html` from `main` at the repository root. The HTML includes the UI, styles, photographs, official branches and public offers. Serve it beside `uae-dining.json` and `DATA-LICENSE.txt` for the full directory. Only a Supabase **publishable** key is included. Never add database passwords, SMTP passwords, service-role keys or OAuth client secrets to this repository.

## Backend

Apply `backend/schema.sql` and migrations 002 through 012 in order before opening registration. Keep confirmation enabled during a migration from the historical owner configuration. Migration 004 retires email-based promotion and binds the existing verified operator to their account UUID. On a new installation, pin the verified operator account privately by UUID and verified email before assigning its developer role. Migration 006 authorizes a native password session on any device for that account. The same login form serves customers and the operator. Password recovery is a separate, explicit action. PostgreSQL policies protect the customer records and the restaurant controls.

Restaurant applications require developer approval. Orders use authoritative menu prices, membership expiry, server-calculated discounts, idempotency and a controlled fulfillment state machine. Restaurant delivery and pickup are supported.

Customers can register with an email address and a six-digit password and enter the app immediately. The app offers a one-use recovery key after sign-in or signup. The customer can replace it after a fresh login in account settings. Reset requires the secret key together with the account identifier, invalidates the old password and ends existing refresh sessions. The project’s default email service is limited to project team addresses. Enable a custom SMTP sender and set `publicRecoveryMail` to true for general email recovery. The app reads the live Google OAuth and phone/SMS provider settings. Both providers still need their own service configuration. Migration 007 enables native orders only at approved, open, non-demo restaurants with available menu items. Each signed-in buyer can submit their own cart, including verified operators. The server rejects a changed total before committing the order. The standalone practice kitchen never transmits orders. Published ads and ordering cards open an in-app branch dialog with contact details and a basket action. Using a restaurant’s published WhatsApp prepares the selected items for the customer to send. Telephone-only branches provide a direct call link and a copyable order summary. Dining offers retain their reservation terms. Restaurant confirmation is explicit. Migration 008 lets a business publish its own address, telephone and optional WhatsApp. Membership examples and demo menus are illustrative. Operator-published offers link directly to their sources, with expiry enforced when supplied. Directory listings do not imply a KOD partnership. Food order settlement stays with the restaurant. Membership payments are available when their live merchant rail is configured.

The free project uses Supabase’s default email templates. Email links return a session in the URL fragment; the official Supabase client consumes and removes it. The app also supports a `#confirm?token_hash=...&type=email` callback if custom SMTP/templates are configured later. Set the Site URL and allowed redirect to the live app above.

`KOD-Source.zip` contains the readable backend migrations, UI sources, tests and this README. Unpack it to run the checks or maintain the backend. The live frontend is also available directly as `index.html` in this repository.

The RTL dining homepage, featured offers and navigation are in `discover.js`. The adaptive app shell uses the VAREX Restaurant terracotta palette. The directory logic is in `dining-directory.js`, with official editorial records in `dining-catalog.json`. Open map data remain a separately downloadable ODbL database. See `geodata/README.md` for provenance and rebuilding. The shell, responsive dining screens and offer cards are styled in `dining.css`, after `base-layout.css` and `campaign.css`. The first-party contacts and menu sources are stored with the records in `dining-catalog.json`. The restaurant dialog and its direct-contact checkout are in `direct-order.js`. The order storefront, checkout and responsive ordering screens are in `ordering.js` and `ordering.css`. The workspace source is in `workspace-v6.js` and `workspace-v6.css`. The account screens and session handling are in `account-auth.js`. The developer navigation, customer details and restaurant management pages are in `owner-console.js`. The official Supabase client is bundled from `assets/vendor/`. Run `python3 build.py` after editing these files or changing any campaign photograph in `assets/` to refresh the standalone `index.html`.

## Membership cards at the counter

Customers and the signed-in developer can open their own stable KOD number and downloadable PNG from the mobile «بطاقتي» tab or the developer dashboard. Opening a card preserves the membership’s activation status. The QR opens the cashier page and contains only the card number. A confirmed operator sets the customer’s expiry in the customer dashboard. Approved restaurants explicitly set their in-store rate in restaurant settings. The default rate is zero. The cashier uses their signed-in branch account, enters the restaurant invoice reference and eligible amount, previews the server quote, then confirms the discount. No payment is processed by the card. The customer can review confirmed counter receipts under membership and savings. The card artwork, local QR encoder and store-counter workflow are in `membership-art.js`, `assets/vendor/qrcode-generator-2.0.4.js`, and `membership-card.js`. The encoder’s MIT license ships alongside it.

## Printable membership and phone wallets

Open `#membership` and select the front or the discount QR. The personal print PDF has two 85.60 × 53.98 mm pages at actual size. Its number remains the same at renewal. Guests download a visibly marked sample. A branch can scan the QR with a camera or with a keyboard-mode 2D reader in the KOD member-number field. Card validity and the branch rate are checked online for each receipt.

Deploy `backend/functions/kod-wallet-pass/index.ts` under `kod-wallet-pass` with JWT verification enabled. It derives the card from the authenticated membership RPC. Wallets store the identifier and QR. Apple Wallet contactless redemption additionally requires an NFC-approved pass and a VAS-compatible integrated checkout. The supplied artwork and QR passes support scanning.

For signed Apple Wallet passes set the issuer’s `KOD_APPLE_PASS_TYPE_ID`, `KOD_APPLE_TEAM_ID`, `KOD_APPLE_SIGNER_CERT_B64`, `KOD_APPLE_SIGNER_KEY_B64` and `KOD_APPLE_WWDR_B64` in Edge Function Secrets. Supply `KOD_APPLE_KEY_PASSPHRASE` for an encrypted signing key. Certificate and key variables contain base64-encoded PEM files. Use the Apple intermediate that signed the pass certificate.

For Samsung Wallet use an approved loyalty template and set `KOD_SAMSUNG_CARD_ID`, `KOD_SAMSUNG_PARTNER_ID`, `KOD_SAMSUNG_CERTIFICATE_ID`, `KOD_SAMSUNG_PUBLIC_CERT_B64` (Samsung's encryption certificate) and `KOD_SAMSUNG_SIGNER_KEY_B64` (the partner's signing key). The members-only function produces the v3 encrypted and signed card-data link at the time of the click. The button offers an importable QR image on compatible Galaxy devices when direct issuance is unavailable. The public Samsung app-link logo is `k.png`.

## Fixed-term subscriptions

The subscriptions page is available from the homepage and membership card at `#subscriptions`. A single AED payment buys 1, 3, 6 or 12 calendar months for 69, 189, 359 or 599. The renewal extends any currently active term. Test credentials never enable collecting on the live app.

Deploy `backend/functions/kod-payments/index.ts` as the Supabase function `kod-payments` with gateway JWT verification enabled. Stripe-hosted Checkout accepts cards and eligible wallets. Store the live merchant key with creation and retrieval permission in Edge Function Secrets as `KOD_STRIPE_SECRET_KEY`. Enable cards, Apple Pay and Google Pay in the UAE merchant Dashboard.

For supported direct carrier billing use the merchant-approved Apaya/Infomedia production workflow. Configure Edge Function Secrets `KOD_APAYA_TOKEN_URL` (the approved live RequestToken URL on api.apaya.io), `KOD_APAYA_API_KEY`, `KOD_APAYA_USER`, `KOD_APAYA_PASSWORD` and `KOD_APAYA_MERCHANT_ID`. `KOD_APAYA_PRODUCTS` is a JSON object with `etisalat` and `du` keys. Each maps individually approved durations to the merchant's fixed-price, single-payment AED product IDs. Configure each workflow to accept only its operator and agreed tax-inclusive total. Provide a receipt email for phone-only members.

During merchant setup configure the protected reconciliation worker in Supabase Vault. The scheduler credential `kod_payments_worker_jwt` is the same project's service-role JWT, stored only in its private Vault, never in client code, logs or the repository. The scheduled task stays idle until the credential exists. Public availability expires if the worker stops running. The backend reads payment status directly from Stripe or Apaya, validates the stored checkout and exact AED charge, and issues each paid term once. A browser return only displays account-scoped payment status. Run `node tests/payments.test.mjs` and `backend/verify-subscriptions.sql` to check the fixed prices, confirmed amounts, expiry and isolation with fixtures.

## Verification

Run `node tests/workspace.test.cjs` for frontend cart pricing, role guards and the demo fulfillment journey. `backend/verify-rls.sql` exercises real SQL policies and ordering; its fixtures roll back. The live QA covers 16 groups, including cross-customer and cross-merchant isolation. `backend/verify-owner.sql` checks two independent password sessions, the private customer directory, restaurant controls and rejected customer or recovery-only sessions. Its fixtures roll back. `backend/verify-contact.sql` checks public branch information and owner-only editing. `backend/verify-membership-card.sql` verifies card issuance, activation, expiry, branch opt-in, receipt isolation and idempotency with rolled-back fixtures.

Image/brand sources are documented in `image-sources.json`.


## Member referrals and marketing

The home screen, membership and account link to `#rewards`. Customers share a personal subscription link and see attributed signups, first payments and earned days. Rewards default to 7 membership days. The owner can change future offers in `#marketing`. Confirmed payments use the existing payment settlement path. Repeated notifications and renewals do not generate a second reward.

The marketing desk supports tracked restaurant QR posters, community and regional links, creator agreements and company seat batches. Metrics are limited to the authorized account. Creator commissions are calculated on the first confirmed payment. Issuing corporate seats requires approval from the developer. The member savings export includes the offer name and amounts only, with examples marked on the export.

Apply `backend/013-marketing-referrals.sql` followed by `backend/014-marketing-campaigns.sql` after the subscription migrations. Run `backend/verify-marketing.sql` to exercise disposable accounts, first-payment settlement, permission checks, QR participation and seat redemption inside a rolled-back transaction. Run `python build.py` to rebuild the app and seven regional guides. Serve `city-*.html` and `sitemap.xml` beside the existing entry point.

## Customer tiers and paid restaurant placements

The customer subscription screen at `#subscriptions` offers bronze for 69 AED per month, silver for 189 AED per three months, and gold for 359 AED per six months or 599 AED per year. These are prepaid terms. Confirmed renewals start after the current membership period. Each approved restaurant can set a base rate for KOD orders and another at the register, with optional extra percentage points for silver and gold. The order server and the cashier use the same tier rules.

A customer may request a private invoice for the selected tier. Under customer memberships the verified owner issues payment instructions or an HTTPS payment link and records the confirmed amount and payment reference. Settlement extends the member's card and attributes the first qualifying referral. Hosted checkout stays available according to each provider's actual readiness.

Approved restaurants request a 30-day placement per branch at `#featured`. The initial rate is 149 AED. The verified owner can change the future rate, issue a private invoice, and confirm receipt. Only paid placements within their dates appear in the home page's sponsored section. The section follows the selected emirate and rotates participating branches daily. Each restaurant sees its own placement dates and the count of distinct signed-in customers who opened its listing. Restaurant payments do not purchase a customer membership.

Apply the numbered migrations through `backend/017-member-invoices.sql` in order. Run `backend/verify-club.sql` and `backend/verify-member-invoices.sql` to exercise tier transitions, in-store and online rates, invoice isolation, confirmation and placement expiry using rolled-back fixtures.
