# Private deployment

The source repository is private. Do not enable ordinary GitHub Pages for this
repository: without GitHub Enterprise Cloud organization access control, the
published site is public even when the source repository is private.

## Cloudflare Pages

- Connect this private GitHub repository to Cloudflare Pages.
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

## GitHub sign-in gate

In Cloudflare Zero Trust, add GitHub as an identity provider and protect the
Pages hostname with a Cloudflare Access application. Keep the default-deny
behavior and add only an explicit allow policy.

For a small group, use one of these policies:

1. Allow the exact verified email addresses returned by GitHub login.
2. Put the approved GitHub users in a private GitHub organization/team and use
   the GitHub identity-provider group selector.

Do not put an allowlist in the frontend bundle. Client-side checks can be
bypassed and do not protect the application files.
