export type SavedItemType = 'Room' | 'Message';

export interface SavedItem {
    type: SavedItemType;
    id: string;
    roomId: string;
    savedAt: string;
}
