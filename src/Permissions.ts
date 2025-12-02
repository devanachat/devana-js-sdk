export enum Layer {
    Global,
    Space,
    Room,
    Topic,
}

export class PermissionDefinition {
    value: number;
    maxLayer: Layer;
}

export class Permissions {
    public static readonly list = {
        Root: {value: 1 << 0, maxLayer: Layer.Room},
        CreateSpaces: {value: 1 << 1, maxLayer: Layer.Global},
        ManageSpace: {value: 1 << 2, maxLayer: Layer.Space},
        ManageSpaceRoles: {value: 1 << 3, maxLayer: Layer.Space},
        ManageRoom: {value: 1 << 4, maxLayer: Layer.Room},
        CreateTopics: {value: 1 << 5, maxLayer: Layer.Room},
        ManageTopic: {value: 1 << 6, maxLayer: Layer.Topic},
        ManageSpaceMembers: {value: 1 << 7, maxLayer: Layer.Space},
        ManageRoomMembers: {value: 1 << 8, maxLayer: Layer.Room},
        CreateMessages: {value: 1 << 9, maxLayer: Layer.Topic},
        ManagePermissions: {value: 1 << 10, maxLayer: Layer.Topic},
        CreateSpaceRooms: {value: 1 << 11, maxLayer: Layer.Space},
        ManageSpaceRooms: {value: 1 << 12, maxLayer: Layer.Space},
        CreateEmoticons: {value: 1 << 13, maxLayer: Layer.Space},
        ManageEmoticon: {value: 1 << 14, maxLayer: Layer.Space},
        ManageBan: {value: 1 << 15, maxLayer: Layer.Room},
        Kick: {value: 1 << 16, maxLayer: Layer.Room},
        ChangeOwnNick: {value: 1 << 17, maxLayer: Layer.Space},
        ChangeOwnColor: {value: 1 << 18, maxLayer: Layer.Room},
    };

    public static getNames(): (keyof typeof this.list)[] {
        return Object.keys(this.list) as any;
    }

    public static getByName(name: keyof typeof this.list): PermissionDefinition | undefined {
        return this.list[name];
    }

    public static canBeDefinedOnLayer(permissionName: keyof typeof this.list, layer: Layer): boolean {
        const def = this.getByName(permissionName);

        if (! def) {
            throw new Error(`Invalid permission name: ${permissionName}`);
        }

        return layer <= this.getByName(permissionName).maxLayer;
    }
}