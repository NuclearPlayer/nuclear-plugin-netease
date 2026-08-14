import type {
  NuclearPluginAPI,
  Stream,
  StreamCandidate,
  StreamingProvider,
} from '@nuclearplayer/plugin-sdk';

import { NeteaseClient } from './client';
import { config } from './config';
import { mapSongToStreamCandidate } from './mappers';

export const createStreamingProvider = (
  api: NuclearPluginAPI,
): StreamingProvider => {
  const client = new NeteaseClient(api.Http.fetch);

  return {
    id: config.streamingProviderId,
    kind: 'streaming',
    name: 'NetEase Cloud Music',

    searchForTrack: async (
      artist: string,
      title: string,
    ): Promise<StreamCandidate[]> => {
      const songs = await client.searchSongs(
        `${artist} ${title}`,
        config.streamingSearchLimit,
      );
      return songs.map(mapSongToStreamCandidate);
    },

    getStreamUrl: async (candidateId: string): Promise<Stream> => {
      const url = `${config.apiBase}/#/song?id=${candidateId}`;
      const info = await api.Ytdlp.getStream(url);

      return {
        url: info.stream_url,
        protocol: 'https',
        durationMs: info.duration ? info.duration * 1000 : undefined,
        container: info.container ?? undefined,
        codec: info.codec ?? undefined,
        source: { provider: config.streamingProviderId, id: candidateId },
      };
    },
  };
};
