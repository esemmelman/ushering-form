# High Holiday Usher Form

A public volunteer sign-up form for the 2026 High Holidays. It saves a volunteer's name and selected service times to the `bnaimitzvah` Supabase project.

Live site: <https://esemmelman.github.io/ushering-form/>

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The Supabase publishable key in the browser is intentionally public. Database access is limited to anonymous inserts; submissions cannot be read, edited, or deleted through the public client.

Names are unique after trimming spaces and ignoring capitalization.
