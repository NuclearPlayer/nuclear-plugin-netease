import type {
  Album,
  AlbumRef,
  ArtistBio,
  ArtistRef,
  ArtworkSet,
  ProviderRef,
  StreamCandidate,
  Track,
  TrackRef,
} from '@nuclearplayer/plugin-sdk';

import { config } from './config';
import type {
  NeteaseAlbumDetail,
  NeteaseAlbumSong,
  NeteaseArtistAlbum,
  NeteaseArtistDetail,
  NeteaseArtistRef,
  NeteaseDetailSong,
  NeteaseSearchAlbum,
  NeteaseSearchArtist,
  NeteaseSearchSong,
} from './types';

const makeSource = (providerId: string, id: number): ProviderRef => ({
  provider: providerId,
  id: String(id),
});

const makeArtworkSet = (picUrl?: string): ArtworkSet | undefined => {
  if (!picUrl) {
    return undefined;
  }
  return {
    items: [
      {
        url: `${picUrl}?param=1000y1000`,
        width: 1000,
        height: 1000,
        purpose: 'cover',
      },
      {
        url: `${picUrl}?param=300y300`,
        width: 300,
        height: 300,
        purpose: 'thumbnail',
      },
    ],
  };
};

const makeReleaseDate = (
  publishTimeMs: number,
): Album['releaseDate'] | undefined => {
  if (!publishTimeMs) {
    return undefined;
  }
  const [dateIso] = new Date(publishTimeMs).toISOString().split('T');
  return { precision: 'day', dateIso };
};

const toArtistRef = (artist: NeteaseArtistRef): ArtistRef => ({
  name: artist.name,
  artwork: makeArtworkSet(artist.picUrl),
  source: makeSource(config.metadataProviderId, artist.id),
});

const toArtistCredit = (artist: NeteaseArtistRef): Track['artists'][number] => ({
  name: artist.name,
  roles: [],
  source: makeSource(config.metadataProviderId, artist.id),
});

export const mapSongToTrack = (song: NeteaseSearchSong): Track => ({
  title: song.name,
  artists: song.artists.map(toArtistCredit),
  album: {
    title: song.album.name,
    source: makeSource(config.metadataProviderId, song.album.id),
  },
  durationMs: song.duration,
  source: makeSource(config.metadataProviderId, song.id),
});

export const mapSongToStreamCandidate = (
  song: NeteaseSearchSong,
): StreamCandidate => ({
  id: String(song.id),
  title: song.name,
  durationMs: song.duration,
  failed: false,
  source: makeSource(config.streamingProviderId, song.id),
});

export const mapArtistToArtistRef = (artist: NeteaseSearchArtist): ArtistRef => ({
  name: artist.name,
  artwork: makeArtworkSet(artist.picUrl),
  source: makeSource(config.metadataProviderId, artist.id),
});

export const mapAlbumToAlbumRef = (album: NeteaseSearchAlbum): AlbumRef => ({
  title: album.name,
  artists: album.artists.map(toArtistRef),
  artwork: makeArtworkSet(album.picUrl),
  source: makeSource(config.metadataProviderId, album.id),
});

export const mapArtistDetailToArtistBio = (
  detail: NeteaseArtistDetail,
): ArtistBio => ({
  name: detail.name,
  bio: detail.briefDesc,
  artwork: makeArtworkSet(detail.picUrl),
  source: makeSource(config.metadataProviderId, detail.id),
});

export const mapDetailSongToTrackRef = (song: NeteaseDetailSong): TrackRef => ({
  title: song.name,
  artists: song.artists.map(toArtistRef),
  artwork: makeArtworkSet(song.album.picUrl),
  source: makeSource(config.metadataProviderId, song.id),
});

export const mapAlbumDetailToAlbum = (
  album: NeteaseAlbumDetail,
  songs: NeteaseAlbumSong[],
): Album => ({
  title: album.name,
  artists: (album.artists ?? [album.artist]).map(toArtistCredit),
  tracks: songs.map((song) => ({
    title: song.name,
    artists: song.ar.map(toArtistRef),
    artwork: makeArtworkSet(song.al.picUrl),
    source: makeSource(config.metadataProviderId, song.id),
  })),
  releaseDate: makeReleaseDate(album.publishTime),
  artwork: makeArtworkSet(album.picUrl),
  source: makeSource(config.metadataProviderId, album.id),
});

export const mapArtistAlbumToAlbumRef = (
  album: NeteaseArtistAlbum,
): AlbumRef => ({
  title: album.name,
  artists: [toArtistRef(album.artist)],
  artwork: makeArtworkSet(album.picUrl),
  source: makeSource(config.metadataProviderId, album.id),
});
