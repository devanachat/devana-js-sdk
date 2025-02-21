export declare enum Layer {
    Global = 0,
    Space = 1,
    Room = 2,
    Topic = 3
}
export declare class PermissionDefinition {
    value: number;
    maxLayer: Layer;
}
export declare class Permissions {
    static readonly list: {
        Root: {
            value: number;
            maxLayer: Layer;
        };
        CreateSpaces: {
            value: number;
            maxLayer: Layer;
        };
        ManageSpace: {
            value: number;
            maxLayer: Layer;
        };
        ManageSpaceRoles: {
            value: number;
            maxLayer: Layer;
        };
        ManageRoom: {
            value: number;
            maxLayer: Layer;
        };
        CreateTopics: {
            value: number;
            maxLayer: Layer;
        };
        ManageTopic: {
            value: number;
            maxLayer: Layer;
        };
        ManageSpaceMembers: {
            value: number;
            maxLayer: Layer;
        };
        ManageRoomMembers: {
            value: number;
            maxLayer: Layer;
        };
        CreateMessages: {
            value: number;
            maxLayer: Layer;
        };
        ManagePermissions: {
            value: number;
            maxLayer: Layer;
        };
        CreateSpaceRooms: {
            value: number;
            maxLayer: Layer;
        };
        ManageSpaceRooms: {
            value: number;
            maxLayer: Layer;
        };
        CreateEmoticons: {
            value: number;
            maxLayer: Layer;
        };
        ManageEmoticon: {
            value: number;
            maxLayer: Layer;
        };
        ManageBan: {
            value: number;
            maxLayer: Layer;
        };
        Kick: {
            value: number;
            maxLayer: Layer;
        };
    };
    static getNames(): (keyof typeof this.list)[];
    static getByName(name: keyof typeof this.list): PermissionDefinition | undefined;
    static canBeDefinedOnLayer(permissionName: keyof typeof this.list, layer: Layer): boolean;
}
