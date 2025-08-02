export enum UserRelationshipType {
    Ignore = 'Ignore',
}

export interface UserRelationship {
    userId: string;
    refUserId: string;
    type: UserRelationshipType;
}