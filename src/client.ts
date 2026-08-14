import type { FetchFunction } from '@nuclearplayer/plugin-sdk';

import { config } from './config';
import { createNeteaseFetch } from './fetch';
import {
  SearchType,
  type NeteaseAlbumDetailResult,
  type NeteaseAlbumSearchResult,
  type NeteaseApiResponse,
  type NeteaseArtistAlbum,
  type NeteaseArtistAlbumsResult,
  type NeteaseArtistDetailResult,
  type NeteaseArtistSearchResult,
  type NeteaseSearchAlbum,
  type NeteaseSearchArtist,
  type NeteaseSearchSong,
  type NeteaseSongSearchResult,
} from './types';

export class NeteaseClient {
  private fetch: FetchFunction;

  constructor(baseFetch: FetchFunction) {
    this.fetch = createNeteaseFetch(baseFetch);
  }

  async searchSongs(query: string, limit: number): Promise<NeteaseSearchSong[]> {
    const data = await this.request<NeteaseSongSearchResult>('/api/search/get', {
      s: query,
      type: SearchType.Song,
      limit,
      offset: 0,
    });
    const songs = data.result.songs ?? [];
    return songs.filter((song) => song.fee === 0);
  }

  async searchArtists(query: string, limit: number): Promise<NeteaseSearchArtist[]> {
    const data = await this.request<NeteaseArtistSearchResult>('/api/search/get', {
      s: query,
      type: SearchType.Artist,
      limit,
      offset: 0,
    });
    return data.result.artists ?? [];
  }

  async searchAlbums(query: string, limit: number): Promise<NeteaseSearchAlbum[]> {
    const data = await this.request<NeteaseAlbumSearchResult>('/api/search/get', {
      s: query,
      type: SearchType.Album,
      limit,
      offset: 0,
    });
    return data.result.albums ?? [];
  }

  async getArtistDetail(artistId: string): Promise<NeteaseArtistDetailResult> {
    const data = await this.request<NeteaseArtistDetailResult>(
      `/api/artist/${artistId}`,
    );
    const freeSongs = data.hotSongs.filter((song) => song.fee === 0);
    return { artist: data.artist, hotSongs: freeSongs };
  }

  async getArtistAlbums(artistId: string): Promise<NeteaseArtistAlbum[]> {
    const pageSize = 50;
    const albums: NeteaseArtistAlbum[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore && albums.length < config.maxArtistAlbums) {
      const data = await this.request<NeteaseArtistAlbumsResult>(
        `/api/artist/albums/${artistId}`,
        { limit: pageSize, offset },
      );
      albums.push(...data.hotAlbums);
      hasMore = data.more;
      offset += pageSize;
    }

    return albums.slice(0, config.maxArtistAlbums);
  }

  async getAlbumDetail(albumId: string): Promise<NeteaseAlbumDetailResult> {
    const data = await this.request<NeteaseAlbumDetailResult>(
      `/api/v1/album/${albumId}`,
    );
    const freeSongs = data.songs.filter((song) => song.fee === 0);
    return { album: data.album, songs: freeSongs };
  }

  private async request<T>(
    path: string,
    params?: Record<string, string | number>,
  ): Promise<NeteaseApiResponse<T>> {
    const url = new URL(path, config.apiBase);
    if (params) {
      url.search = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, `${value}`]),
      ).toString();
    }
    const response = await this.fetch(url.toString());
    if (!response.ok) {
      throw new Error(`NetEase API error: ${response.status} for ${path}`);
    }
    const data = (await response.json()) as NeteaseApiResponse<T>;
    if (data.code !== 200) {
      throw new Error(`NetEase API returned code ${data.code} for ${path}`);
    }
    return data;
  }
}
