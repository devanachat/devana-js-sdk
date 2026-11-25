import {SavedItem} from "../SavedItem";
import {Message} from "../Message";

export interface ItemSaved {
    item: SavedItem;
    message: Message | null;
}
