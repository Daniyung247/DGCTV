# DGC TV News — Supabase + Vercel starter

Responsive static news website with Supabase-backed articles, admin login, drafts/publishing, image uploads, and starter policy/contact pages. This is a starter project, not a managed or audited production service. Test it before relying on it.

## Included
- `index.html`: public homepage, search, categories and article reader
- `admin.html`: sign-in and newsroom dashboard
- `app.js`, `admin.js`, `style.css`: frontend
- `config.js`: public Supabase project URL and anon/publishable key placeholders
- `supabase/schema.sql`: article tables, row-level security (RLS) and image bucket/policies
- `about.html`, `contact.html`, `privacy.html`: starter pages
- `robots.txt`, `sitemap.xml`, `vercel.json`

## Setup on Android
1. Create a project at https://supabase.com/.
2. In Supabase, open **SQL Editor**, paste all contents of `supabase/schema.sql`, and run it.
3. In Supabase project settings / API, copy the **Project URL** and **anon/public/publishable key**.
4. Edit `config.js` in GitHub. Replace `PASTE_YOUR_SUPABASE_PROJECT_URL_HERE` and `PASTE_YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE` with those public values, then commit.
5. In Supabase **Authentication → Users**, create/invite your admin user. Use a strong password and keep account recovery email secure. Disable public sign-ups if not needed.
6. Copy the admin user's UUID. In SQL Editor, run this after replacing the sample UUID:

```sql
insert into public.admins(user_id) values ('PASTE-AUTH-USER-UUID-HERE') on conflict(user_id) do nothing;
```

7. Commit all project files to the GitHub repository connected to your existing Vercel project. Use Framework Preset **Other**, no build command, output directory `.`. Deploy.
8. Visit `https://dgctv.online/` and `https://dgctv.online/admin.html`. Sign in and create a test draft. Publish a test article and verify it appears on the homepage.

## Security essentials
- Never place Supabase `service_role`, secret keys, database passwords, or access tokens in `config.js` or GitHub. Browser code must use the public anon/publishable key only.
- The public key is not a secret; RLS policies are what protect the database. The allowlist in `public.admins` is manually controlled and there is no client-side self-enrolment policy.
- Images in `article-images` are public by design so published article images load for visitors. Never upload private/sensitive files.
- Limit admin access to trusted staff; use a unique strong password and enable MFA on the associated email account.

## Before public launch
- Replace the starter About/Privacy/Contact copy with accurate details and a monitored newsroom email.
- Publish original reporting or content you have permission to use. Fact-check claims, attribute sources, label sponsored content, and publish corrections transparently.
- Ad space is only a placeholder. Add ad code only after account approval and policy review.
- The starter sitemap lists only static pages. As you publish more articles, implement/update a sitemap containing article URLs and validate it in Google Search Console.
- Review Supabase RLS and storage policies and test access with both an admin and a non-admin account. This starter has not been independently security audited.

## Troubleshooting
- Setup required: config.js still has placeholder values.
- No stories load: confirm SQL ran, URL/key are correct and the browser console/network shows no configuration errors.
- Admin denied: add the authenticated user's exact UUID to `public.admins` using SQL Editor.
- Upload denied: confirm the `article-images` bucket and policies exist and the signed-in user is allowlisted.
- Slug conflict: every article slug must be unique.
