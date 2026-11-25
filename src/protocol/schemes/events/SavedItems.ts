import {SavedItem} from "../SavedItem";
import {Message} from "../Message";

export interface SavedItems {
    items: SavedItem[];
    messages: Message[];
}
