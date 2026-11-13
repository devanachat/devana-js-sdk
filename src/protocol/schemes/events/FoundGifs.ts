export interface FoundGif {
    id: string;
    url: string;
    title: string;
    width: number;
    height: number;
    posterUrl: string;
    mp4Url: string | null;
    webmUrl: string | null;
}

export interface FoundGifs {
    gifs: FoundGif[];
    next: string | null;
}
