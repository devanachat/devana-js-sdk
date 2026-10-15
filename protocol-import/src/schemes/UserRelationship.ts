import {User} from "./User";

export type UserRelationshipType = 'Ignore';

export interface UserRelationship {
    refUser: User;
    type: UserRelationshipType;
}