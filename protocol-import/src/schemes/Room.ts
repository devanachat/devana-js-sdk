import {Topic} from "./Topic";
import {User} from "./User";
import {RoomStream} from "./RoomStream";
import {RoomHistory} from "./RoomHistory";

export type RoomType = 'Text' | 'ClassicText' | 'Pm';

export interface Room {
    id: string;
    spaceId: string | null;
    name: string;
    description: string;
    type: RoomType;
    defaultTopic: Topic | null;
    recipients: User[] | null;
    flags: number;
    stream: RoomStream | null;
    history: RoomHistory | null;
}