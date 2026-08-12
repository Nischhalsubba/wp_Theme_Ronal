# Netlify portfolio deployment

This directory is the isolated Netlify build base for Ronal Chhetri's static portfolio.

Netlify runs:

```sh
sh build.sh
```

and publishes `dist/`. Keeping the base inside `portfolio/` prevents the preserved legacy WordPress theme's root `package.json`, `package-lock.json`, Gulp tasks, and `node-sass` dependency from being installed during the static-site build.
