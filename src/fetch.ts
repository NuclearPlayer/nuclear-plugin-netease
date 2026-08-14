import type { FetchFunction } from '@nuclearplayer/plugin-sdk';

import { config } from './config';

export const createNeteaseFetch =
  (baseFetch: FetchFunction): FetchFunction =>
  (input, init) =>
    baseFetch(input, {
      ...init,
      headers: {
        Referer: config.referer,
        'X-Forwarded-For': config.forwardedIp,
        ...init?.headers,
      },
    });
