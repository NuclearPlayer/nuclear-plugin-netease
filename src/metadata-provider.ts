import type {
  Album,
  AlbumRef,
  ArtistBio,
  ArtistRef,
  MetadataProvider,
  NuclearPluginAPI,
  SearchParams,
  Track,
  TrackRef,
} from '@nuclearplayer/plugin-sdk';

import { NeteaseClient } from './client';
import { config } from './config';
import {
  mapAlbumDetailToAlbum,
  mapAlbumToAlbumRef,
  mapArtistAlbumToAlbumRef,
  mapArtistDetailToArtistBio,
  mapArtistToArtistRef,
  mapDetailSongToTrackRef,
  mapSongToTrack,
} from './mappers';
import type { NeteaseArtistDetailResult } from './types';

type ArtistDetailCacheEntry = {
  data: NeteaseArtistDetailResult;
  timestamp: number;
};

export const createMetadataProvider = (
  api: NuclearPluginAPI,
): MetadataProvider => {
  const client = new NeteaseClient(api.Http.fetch);
  const artistDetailCache = new Map<string, ArtistDetailCacheEntry>();

  const getCachedArtistDetail = async (
    artistId: string,
  ): Promise<NeteaseArtistDetailResult> => {
    const cached = artistDetailCache.get(artistId);
    if (cached && Date.now() - cached.timestamp < config.artistCacheTtlMs) {
      return cached.data;
    }
    const data = await client.getArtistDetail(artistId);
    artistDetailCache.set(artistId, { data, timestamp: Date.now() });
    return data;
  };

  return {
    id: config.metadataProviderId,
    kind: 'metadata',
    name: 'NetEase Cloud Music',
    streamingProviderId: config.streamingProviderId,
    searchCapabilities: ['artists', 'albums', 'tracks'],
    artistMetadataCapabilities: [
      'artistBio',
      'artistTopTracks',
      'artistAlbums',
    ],
    albumMetadataCapabilities: ['albumDetails'],

    searchArtists: async (
      params: Omit<SearchParams, 'types'>,
    ): Promise<ArtistRef[]> => {
      const artists = await client.searchArtists(
        params.query,
        params.limit ?? config.defaultSearchLimit,
      );
      return artists.map(mapArtistToArtistRef);
    },

    searchAlbums: async (
      params: Omit<SearchParams, 'types'>,
    ): Promise<AlbumRef[]> => {
      const albums = await client.searchAlbums(
        params.query,
        params.limit ?? config.defaultSearchLimit,
      );
      return albums.map(mapAlbumToAlbumRef);
    },

    searchTracks: async (
      params: Omit<SearchParams, 'types'>,
    ): Promise<Track[]> => {
      const songs = await client.searchSongs(
        params.query,
        params.limit ?? config.defaultSearchLimit,
      );
      return songs.map(mapSongToTrack);
    },

    fetchArtistBio: async (artistId: string): Promise<ArtistBio> => {
      const { artist } = await getCachedArtistDetail(artistId);
      return mapArtistDetailToArtistBio(artist);
    },

    fetchArtistTopTracks: async (artistId: string): Promise<TrackRef[]> => {
      const { hotSongs } = await getCachedArtistDetail(artistId);
      return hotSongs.map(mapDetailSongToTrackRef);
    },

    fetchArtistAlbums: async (artistId: string): Promise<AlbumRef[]> => {
      const albums = await client.getArtistAlbums(artistId);
      return albums.map(mapArtistAlbumToAlbumRef);
    },

    fetchAlbumDetails: async (albumId: string): Promise<Album> => {
      const { album, songs } = await client.getAlbumDetail(albumId);
      return mapAlbumDetailToAlbum(album, songs);
    },
  };
};
