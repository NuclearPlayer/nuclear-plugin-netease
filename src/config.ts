export const config = {
  metadataProviderId: 'netease',
  streamingProviderId: 'netease-stream',
  apiBase: 'https://music.163.com',
  referer: 'https://music.163.com',
  forwardedIp: '36.166.22.58',
  defaultSearchLimit: 15,
  streamingSearchLimit: 5,
  artistCacheTtlMs: 30_000,
} as const;
