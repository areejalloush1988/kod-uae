# KOD UAE

Arabic RTL dining guide for restaurants, cafés and cafeterias in the UAE. The searchable nationwide directory uses a local OpenStreetMap snapshot. A second index links named branches to official sources, and published dining offers link to operator terms. Dining membership and ordering examples, account dashboards and order updates are also available.

Live app: https://areejalloush1988.github.io/kod-uae/

## Deployment

GitHub Pages serves `index.html` from `main` at the repository root. The HTML includes the UI, styles, photographs, official branches and public offers. Serve it beside `uae-dining.json` and `DATA-LICENSE.txt` for the full directory. Only a Supabase **publishable** key is included. Never add database passwords, SMTP passwords, service-role keys or OAuth client secrets to this repository.

## Backend

On a new, empty KOD database apply `backend/schema.sql`, then `backend/002-verified-owner.sql` and `backend/003-dining-venue-types.sql`. The owner migration allows the designated owner to sign in with server-confirmed email as well as verified Google. Editable signup metadata cannot grant roles. Customer, restaurant and developer access is enforced in PostgreSQL.

Restaurant applications require developer approval. Orders use authoritative menu prices, membership expiry, server-calculated discounts, idempotency and a controlled fulfillment state machine. Restaurant delivery and pickup are supported.

**Current launch state:** account forms are connected; email confirmation and magic links are configured for owner testing. Public email delivery needs a custom SMTP sender. Google OAuth, phone SMS and UAE PASS remain disabled until their providers are configured. Real ordering remains disabled until actual restaurants and operating terms are ready. Membership examples and demo menus are illustrative. Operator-published offers link directly to their sources, with expiry enforced when supplied. Directory listings do not imply a KOD partnership. No online payments are enabled.

The free project uses Supabase’s default email templates. Email links return a session in the URL fragment; the official Supabase client consumes and removes it. The app also supports a `#confirm?token_hash=...&type=email` callback if custom SMTP/templates are configured later. Set the Site URL and allowed redirect to the live app above.

`KOD-Source.zip` contains the readable backend migrations, UI sources, tests and this README. Unpack it to run the checks or maintain the backend. The live frontend is also available directly as `index.html` in this repository.

The discovery homepage and offers are in `discover.js`. The directory logic is in `dining-directory.js`, with official editorial records in `dining-catalog.json`. Open map data remain a separately downloadable ODbL database. See `geodata/README.md` for provenance and rebuilding. Its layout and campaign styling are in `base-layout.css` and `campaign.css` / `dining.css`. The workspace source is in `workspace-v6.js` and `workspace-v6.css`. Run `python3 build.py` after editing these files or changing any campaign photograph in `assets/` to refresh the standalone `index.html`.

## Verification

Run `node tests/workspace.test.cjs` for frontend cart pricing, role guards and the demo fulfillment journey. `backend/verify-rls.sql` exercises real SQL policies and ordering; its fixtures roll back. Successful live QA covered 14 groups, including cross-customer and cross-merchant isolation. `backend/verify-owner.sql` checks confirmed-email owner bootstrap and rejected unverified claims, also with rollback.

Image/brand sources are documented in `image-sources.json`.
