# KOD UAE

Arabic RTL app for discovering UAE discounts across shopping, entertainment, personal care, travel and eight more categories. It includes restaurant ordering, Supabase Auth, PostgreSQL RLS and realtime order updates.

Live app: https://areejalloush1988.github.io/kod-uae/

## Deployment

GitHub Pages serves `index.html` from `main` at the repository root. The standalone HTML includes the UI, styles and photographs; no build step is required. Only a Supabase **publishable** key is included. Never add database passwords, SMTP passwords, service-role keys or OAuth client secrets to this repository.

## Backend

On a new, empty KOD database apply `backend/schema.sql`, then `backend/002-verified-owner.sql`. The latter allows the designated owner to sign in with server-confirmed email as well as verified Google. Editable signup metadata cannot grant roles. Customer, restaurant and developer access is enforced in PostgreSQL.

Restaurant applications require developer approval. Orders use authoritative menu prices, membership expiry, server-calculated discounts, idempotency and a controlled fulfillment state machine. Restaurant delivery and pickup are supported.

**Current launch state:** account forms are connected; email confirmation and magic links are configured for owner testing. Public email delivery needs a custom SMTP sender. Google OAuth, phone SMS and UAE PASS remain disabled until their providers are configured. Real ordering remains disabled until actual restaurants and operating terms are ready. All displayed brand offers, discounts and demo menus are illustrative, with no implied partnership or dispatch. No online payments are enabled.

The free project uses Supabase’s default email templates. Email links return a session in the URL fragment; the official Supabase client consumes and removes it. The app also supports a `#confirm?token_hash=...&type=email` callback if custom SMTP/templates are configured later. Set the Site URL and allowed redirect to the live app above.

`KOD-Source.zip` contains the readable backend migrations, UI sources, tests and this README. Unpack it to run the checks or maintain the backend. The live frontend is also available directly as `index.html` in this repository.

The discovery homepage is in `discover.js`. Its layout and campaign styling are in `base-layout.css` and `campaign.css`. The workspace source is in `workspace-v6.js` and `workspace-v6.css`. Run `python3 build.py` after editing these files or changing any campaign photograph in `assets/` to refresh the standalone `index.html`.

## Verification

Run `node tests/workspace.test.cjs` for frontend cart pricing, role guards and the demo fulfillment journey. `backend/verify-rls.sql` exercises real SQL policies and ordering; its fixtures roll back. Successful live QA covered 14 groups, including cross-customer and cross-merchant isolation. `backend/verify-owner.sql` checks confirmed-email owner bootstrap and rejected unverified claims, also with rollback.

Image/brand sources are documented in `image-sources.json`.
