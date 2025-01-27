import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { Emoticon } from "../types/src";
export declare class EmoticonsManager {
    private tracker;
    private list;
    private emoticonsPromises;
    constructor(tracker: ChatStateTracker);
    get(spaceId?: string): Promise<ObservableIndexedObjectCollection<Emoticon>>;
    private handleEmoticons;
    private handleNewEmoticon;
    private handleEmoticonDeleted;
    private handleSpaceDeleted;
    private handleSession;
}
