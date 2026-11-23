import {EventTarget} from "../src/EventTarget";
import {PermissionsManager} from "../src/state-tracker/PermissionsManager";
import {Permissions} from "../src";

const SPACE = 's1';
const SEND_ATTACHMENTS = Permissions.list.SendAttachments.value;
const CREATE_MESSAGES = Permissions.list.CreateMessages.value;

type Overwrites = {allow: number | null, deny: number | null};

const createManager = (roles: string[], spaceRolesOverwrites: Record<string, Overwrites>): PermissionsManager => {
    const client = new class extends EventTarget {
        public async send(type: string, data: any): Promise<any> {
            const {location, target} = data;
            const overwrites = type === 'GetPermissionOverwrites' && target.type === 'Role'
                ? spaceRolesOverwrites[target.roleId] ?? {allow: null, deny: null}
                : {allow: null, deny: null};

            return {data: {location, target, overwrites}, error: null};
        }
    };
    const tracker: any = {
        client,
        me: {id: 'me'},
        getMe: async () => ({id: 'me'}),
        rooms: {get: async () => new Map()},
        spaces: {
            get: async () => new Map([[SPACE, {id: SPACE}]]),
            getMe: async () => ({userId: 'me', roles}),
        },
    };

    return new PermissionsManager(tracker);
};

test('a role deny overrides an allow of the default role', async () => {
    const manager = createManager([SPACE, 'guest'], {
        [SPACE]: {allow: SEND_ATTACHMENTS | CREATE_MESSAGES, deny: null},
        guest: {allow: null, deny: SEND_ATTACHMENTS},
    });

    expect(await manager.calculatePermissions({spaceId: SPACE})).toBe(CREATE_MESSAGES);
});

test('an allow of any other role still wins over a role deny', async () => {
    const manager = createManager([SPACE, 'guest', 'member'], {
        [SPACE]: {allow: SEND_ATTACHMENTS, deny: null},
        guest: {allow: null, deny: SEND_ATTACHMENTS},
        member: {allow: SEND_ATTACHMENTS, deny: null},
    });

    expect(await manager.calculatePermissions({spaceId: SPACE})).toBe(SEND_ATTACHMENTS);
});

test('a role allow overrides a deny of the default role', async () => {
    const manager = createManager([SPACE, 'moderator'], {
        [SPACE]: {allow: null, deny: CREATE_MESSAGES},
        moderator: {allow: CREATE_MESSAGES, deny: null},
    });

    expect(await manager.calculatePermissions({spaceId: SPACE})).toBe(CREATE_MESSAGES);
});

test('permissions beyond 32 bits are allowed, denied and checked', async () => {
    const {InviteToCall, ManageCalls, JoinCalls} = Permissions.list;
    const manager = createManager([SPACE, 'moderator', 'muted'], {
        [SPACE]: {allow: InviteToCall.value + JoinCalls.value, deny: null},
        moderator: {allow: ManageCalls.value, deny: null},
        muted: {allow: null, deny: InviteToCall.value},
    });

    expect(await manager.calculatePermissions({spaceId: SPACE})).toBe(ManageCalls.value + JoinCalls.value);

    const result = await manager.check(['ManageCalls', 'InviteToCall', 'JoinCalls'], {spaceId: SPACE});
    expect(result.missing).toEqual(['InviteToCall']);
    expect(result.hasAny).toBe(true);
});

test('Root grants the permissions beyond 32 bits', async () => {
    const manager = createManager([SPACE], {
        [SPACE]: {allow: Permissions.list.Root.value, deny: null},
    });

    const result = await manager.check(['ManageCalls', 'InviteToCall', 'ShareVideo'], {spaceId: SPACE});
    expect(result.hasAll).toBe(true);
});
