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

const WORD = 2 ** 32;

function combineWords(a: number, b: number, operation: (a: number, b: number) => number): number {
    const high = operation(Math.floor(a / WORD), Math.floor(b / WORD)) >>> 0;
    const low = operation(a % WORD, b % WORD) >>> 0;

    return high * WORD + low;
}

export class Permissions {
    public static readonly list = {
        Root: {value: 1 << 0, maxLayer: Layer.Room},
        CreateSpaces: {value: 1 << 1, maxLayer: Layer.Global},
        ManageSpace: {value: 1 << 2, maxLayer: Layer.Space},
        ManageRoles: {value: 1 << 3, maxLayer: Layer.Space},
        CreateTopics: {value: 1 << 5, maxLayer: Layer.Room},
        ManageTopic: {value: 1 << 6, maxLayer: Layer.Topic},
        ManageMemberProfiles: {value: 1 << 7, maxLayer: Layer.Space},
        ManageMemberRoles: {value: 1 << 8, maxLayer: Layer.Room},
        CreateMessages: {value: 1 << 9, maxLayer: Layer.Topic},
        ManagePermissions: {value: 1 << 10, maxLayer: Layer.Topic},
        CreateRooms: {value: 1 << 11, maxLayer: Layer.Space},
        ManageRoom: {value: 1 << 12, maxLayer: Layer.Room},
        CreateEmoticons: {value: 1 << 13, maxLayer: Layer.Space},
        ManageEmoticons: {value: 1 << 14, maxLayer: Layer.Space},
        ManageBans: {value: 1 << 15, maxLayer: Layer.Room},
        Kick: {value: 1 << 16, maxLayer: Layer.Room},
        ChangeOwnProfile: {value: 1 << 17, maxLayer: Layer.Space},
        ChangeOwnColor: {value: 1 << 18, maxLayer: Layer.Room},
        ManageMessages: {value: 1 << 19, maxLayer: Layer.Topic},
        AddMembers: {value: 1 << 20, maxLayer: Layer.Space},
        React: {value: 1 << 21, maxLayer: Layer.Topic},
        CreatePolls: {value: 1 << 22, maxLayer: Layer.Topic},
        MentionAllRoles: {value: 1 << 23, maxLayer: Layer.Topic},
        PreviewRooms: {value: 1 << 24, maxLayer: Layer.Room},
        SearchMessages: {value: 1 << 25, maxLayer: Layer.Room},
        UseExternalEmoticons: {value: 1 << 26, maxLayer: Layer.Room},
        ManagePins: {value: 1 << 27, maxLayer: Layer.Topic},
        SendAttachments: {value: 1 << 28, maxLayer: Layer.Topic},
        EditMessages: {value: 1 << 29, maxLayer: Layer.Topic},
        JoinCalls: {value: 2 ** 30, maxLayer: Layer.Room},
        ShareVideo: {value: 2 ** 31, maxLayer: Layer.Room},
        InviteToCall: {value: 2 ** 32, maxLayer: Layer.Room},
        ManageCalls: {value: 2 ** 33, maxLayer: Layer.Room},
    };

    /**
     * Whether the permission mask (e.g. from {@link PermissionsManager.calculatePermissions}) grants the permission.
     * Use it and {@link union} / {@link subtract} instead of `&` and `|`: JavaScript bitwise operators keep only
     * 32 bits, and permissions go beyond them.
     */
    public static has(mask: number, name: keyof typeof this.list): boolean {
        const value = this.list[name].value;

        return combineWords(mask, value, (a, b) => a & b) === value;
    }

    /**
     * The permission masks combined (`a | b`), safe for permissions beyond 32 bits.
     */
    public static union(...masks: number[]): number {
        let result = 0;

        for (const mask of masks) {
            result = combineWords(result, mask, (a, b) => a | b);
        }

        return result;
    }

    /**
     * The mask without the permissions of `removed` (`mask & ~removed`), safe for permissions beyond 32 bits.
     */
    public static subtract(mask: number, removed: number): number {
        return combineWords(mask, removed, (a, b) => a & ~b);
    }

    /**
     * Mask of all the permissions this version of the SDK knows - for `SetPermissionOverwrites.knownPermissions`.
     */
    public static getKnownMask(): number {
        return this.union(...Object.values(this.list).map(permission => permission.value));
    }

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