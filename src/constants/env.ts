export default {
  FRONT_CLIENT: import.meta.env.VITE_FRONT_CLIENT,
  AUTH0_CLIENT: import.meta.env.VITE_AUTH0_CLIENT,
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
  AUTH0_ORGANIZATION: import.meta.env.VITE_AUTH0_ORGANIZATION,
  BE_URL: import.meta.env.VITE_BE_URL,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  STAGE: import.meta.env.VITE_STAGE,
  GITHUB_SHA: import.meta.env.VITE_APP_GITHUB_SHA,
  GROWTHBOOK_KEY: import.meta.env.VITE_GROWTHBOOK_KEY,
};
