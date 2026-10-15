import {UserRelationshipType} from "../UserRelationship";

export interface DeleteRelationship {
    refUserId: string;
    type: UserRelationshipType;
}