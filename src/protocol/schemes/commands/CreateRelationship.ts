import {UserRelationshipType} from "../UserRelationship";

export interface CreateRelationship {
    refUserId: string;
    type: UserRelationshipType;
}