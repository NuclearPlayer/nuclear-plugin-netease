export type NeteaseApiResponse<T> = { code: number } & T;

export enum SearchType {
  Song = '1',
  Album = '10',
  Artist = '100',
}

export type NeteaseArtistRef = {
  id: number;
  name: string;
  picUrl?: string;
  alias?: string[];
};

export type NeteaseAlbumRef = {
  id: number;
  name: string;
  picId?: number;
};

export type NeteaseSearchSong = {
  id: number;
  name: string;
  duration: number;
  fee: number;
  artists: NeteaseArtistRef[];
  album: NeteaseAlbumRef;
  alias: string[];
};

export type NeteaseSearchArtist = {
  id: number;
  name: string;
  picUrl?: string;
  alias?: string[];
  albumSize: number;
  musicSize: number;
  img1v1Url?: string;
  trans?: string;
};

export type NeteaseSearchAlbum = {
  id: number;
  name: string;
  picUrl?: string;
  artist: NeteaseArtistRef;
  artists: NeteaseArtistRef[];
  publishTime: number;
  size: number;
  company?: string;
};

export type NeteaseSongSearchResult = {
  result: {
    songs?: NeteaseSearchSong[];
    songCount?: number;
  };
};

export type NeteaseArtistSearchResult = {
  result: {
    artists?: NeteaseSearchArtist[];
    artistCount?: number;
  };
};

export type NeteaseAlbumSearchResult = {
  result: {
    albums?: NeteaseSearchAlbum[];
  };
};

export type NeteaseArtistDetail = {
  id: number;
  name: string;
  picUrl?: string;
  briefDesc?: string;
  alias?: string[];
  albumSize: number;
  musicSize: number;
};

export type NeteaseDetailSong = {
  id: number;
  name: string;
  duration: number;
  fee: number;
  artists: NeteaseArtistRef[];
  album: {
    id: number;
    name: string;
    picUrl?: string;
  };
};

export type NeteaseArtistDetailResult = {
  artist: NeteaseArtistDetail;
  hotSongs: NeteaseDetailSong[];
};

export type NeteaseAlbumDetail = {
  id: number;
  name: string;
  picUrl?: string;
  publishTime: number;
  company?: string;
  description?: string;
  artist: NeteaseArtistRef;
  artists?: NeteaseArtistRef[];
};

export type NeteaseAlbumSong = {
  id: number;
  name: string;
  fee: number;
  ar: NeteaseArtistRef[];
  al: {
    id: number;
    name: string;
    picUrl?: string;
  };
};

export type NeteaseAlbumDetailResult = {
  album: NeteaseAlbumDetail;
  songs: NeteaseAlbumSong[];
};

export type NeteaseArtistAlbum = {
  id: number;
  name: string;
  picUrl?: string;
  publishTime: number;
  size: number;
  artist: NeteaseArtistRef;
};

export type NeteaseArtistAlbumsResult = {
  hotAlbums: NeteaseArtistAlbum[];
  more: boolean;
};
