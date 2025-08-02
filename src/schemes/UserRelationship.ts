import {User} from "./User";

export enum UserRelationshipType {
    Ignore = 'Ignore',
}

export interface UserRelationship {
    refUser: User;
    type: UserRelationshipType;
}