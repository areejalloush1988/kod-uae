# KOD UAE

Arabic RTL dining guide for restaurants, cafés and cafeterias in the UAE. The searchable nationwide directory uses a local OpenStreetMap snapshot. A second index links named branches to official sources, and published dining offers link to operator terms. Dining membership and ordering examples, account dashboards and order updates are also available.

Live app: https://areejalloush1988.github.io/kod-uae/

## Deployment

GitHub Pages serves `index.html` from `main` at the repository root. The HTML includes the UI, styles, photographs, official branches and public offers. Serve it beside `uae-dining.json` and `DATA-LICENSE.txt` for the full directory. Only a Supabase **publishable** key is included. Never add database passwords, SMTP passwords, service-role keys or OAuth client secrets to this repository.

## Backend

Apply `backend/schema.sql` and migrations 002 through 006 in order before opening registration. Keep confirmation enabled during a migration from the historical owner configuration. Migration 004 retires email-based promotion and binds the existing verified operator to their account UUID. On a new installation, pin the verified operator account privately by UUID and verified email before assigning its developer role. Migration 006 authorizes a native password session on any device for that account. The same login form serves customers and the operator. Password recovery is a separate, explicit action. PostgreSQL policies protect the customer records and the restaurant controls.

Restaurant applications require developer approval. Orders use authoritative menu prices, membership expiry, server-calculated discounts, idempotency and a controlled fulfillment state machine. Restaurant delivery and pickup are supported.

Customers can register with an email address and a six-digit password and enter the app immediately. The app offers a one-use recovery key after sign-in or signup. The customer can replace it after a fresh login in account settings. Reset requires the secret key together with the account identifier, invalidates the old password and ends existing refresh sessions. The project’s default email service is limited to project team addresses. Enable a custom SMTP sender and set `publicRecoveryMail` to true for general email recovery. The app reads the live Google OAuth and phone/SMS provider settings. Both providers still need their own service configuration. Real ordering remains disabled until actual restaurants and operating terms are ready. Membership examples and demo menus are illustrative. Operator-published offers link directly to their sources, with expiry enforced when supplied. Directory listings do not imply a KOD partnership. No online payments are enabled.

The free project uses Supabase’s default email templates. Email links return a session in the URL fragment; the official Supabase client consumes and removes it. The app also supports a `#confirm?token_hash=...&type=email` callback if custom SMTP/templates are configured later. Set the Site URL and allowed redirect to the live app above.

`KOD-Source.zip` contains the readable backend migrations, UI sources, tests and this README. Unpack it to run the checks or maintain the backend. The live frontend is also available directly as `index.html` in this repository.

The RTL dining homepage, featured offers and navigation are in `discover.js`. The adaptive app shell uses the VAREX Restaurant terracotta palette. The directory logic is in `dining-directory.js`, with official editorial records in `dining-catalog.json`. Open map data remain a separately downloadable ODbL database. See `geodata/README.md` for provenance and rebuilding. The shell, responsive dining screens and offer cards are styled in `dining.css`, after `base-layout.css` and `campaign.css`. The workspace source is in `workspace-v6.js` and `workspace-v6.css`. The account screens and session handling are in `account-auth.js`. The developer navigation, customer details and restaurant management pages are in `owner-console.js`. The official Supabase client is bundled from `assets/vendor/`. Run `python3 build.py` after editing these files or changing any campaign photograph in `assets/` to refresh the standalone `index.html`.

## Verification

Run `node tests/workspace.test.cjs` for frontend cart pricing, role guards and the demo fulfillment journey. `backend/verify-rls.sql` exercises real SQL policies and ordering; its fixtures roll back. Successful live QA covered 14 groups, including cross-customer and cross-merchant isolation. `backend/verify-owner.sql` checks two independent password sessions, the private customer directory, restaurant controls and rejected customer or recovery-only sessions. Its fixtures roll back.

Image/brand sources are documented in `image-sources.json`.
