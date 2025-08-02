import { User } from "./User";
export declare enum UserRelationshipType {
    Ignore = "Ignore"
}
export interface UserRelationship {
    refUser: User;
    type: UserRelationshipType;
}
