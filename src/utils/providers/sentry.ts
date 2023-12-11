import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';
import env from '@/src/constants/env';

export const useSetupSentry = () => {
  if (env.SENTRY_DSN && env.STAGE && env.STAGE !== 'local') {
    Sentry.init({
      dsn: env.SENTRY_DSN,
      replaysSessionSampleRate: env.STAGE === 'prod' ? 0.3 : 0.0,
      replaysOnErrorSampleRate: env.STAGE === 'prod' ? 1.0 : 0.0,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
          ),
        }),
      ],
      tracesSampleRate: env.STAGE === 'prod' ? 0.3 : 1.0,
      environment: env.STAGE,
    });
  }
};
