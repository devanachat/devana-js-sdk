import {Layer, Permissions} from "../src";

test('can permission be defined on layer', () => {
    expect(Permissions.canBeDefinedOnLayer('CreateMessages', Layer.Global)).toBe(true);
    expect(Permissions.canBeDefinedOnLayer('CreateMessages', Layer.Space)).toBe(true);
    expect(Permissions.canBeDefinedOnLayer('CreateMessages', Layer.Room)).toBe(true);
    expect(Permissions.canBeDefinedOnLayer('CreateMessages', Layer.Topic)).toBe(true);

    expect(Permissions.canBeDefinedOnLayer('CreateSpaces', Layer.Global)).toBe(true);
    expect(Permissions.canBeDefinedOnLayer('CreateSpaces', Layer.Space)).toBe(false);

    expect(Permissions.canBeDefinedOnLayer('ManageMemberProfiles', Layer.Space)).toBe(true);
    expect(Permissions.canBeDefinedOnLayer('ManageMemberProfiles', Layer.Room)).toBe(false);
});

describe('mask arithmetic beyond 32 bits', () => {
    const {JoinCalls, ShareVideo, InviteToCall, ManageCalls, Root} = Permissions.list;

    test('every permission has its own bit', () => {
        expect([JoinCalls.value, ShareVideo.value, InviteToCall.value, ManageCalls.value])
            .toEqual([2 ** 30, 2 ** 31, 2 ** 32, 2 ** 33]);

        const values = Object.values(Permissions.list).map(def => def.value);
        expect(new Set(values).size).toBe(values.length);
        expect(Permissions.union(...values)).toBe(values.reduce((sum, value) => sum + value, 0));
        expect(Permissions.getKnownMask()).toBe(Permissions.union(...values));
        expect(Permissions.has(Permissions.getKnownMask(), 'ManageCalls')).toBe(true);
    });

    test('has', () => {
        const mask = Permissions.union(InviteToCall.value, ManageCalls.value, Root.value);

        expect(Permissions.has(mask, 'InviteToCall')).toBe(true);
        expect(Permissions.has(mask, 'ManageCalls')).toBe(true);
        expect(Permissions.has(mask, 'Root')).toBe(true);
        expect(Permissions.has(mask, 'ShareVideo')).toBe(false);
        expect(Permissions.has(ManageCalls.value, 'Root')).toBe(false);
        expect(Permissions.has(Root.value, 'ManageCalls')).toBe(false);
        expect(Permissions.has(0, 'InviteToCall')).toBe(false);
    });

    test('union and subtract', () => {
        const mask = Permissions.union(ShareVideo.value, InviteToCall.value, ManageCalls.value, Root.value);

        expect(mask).toBe(2 ** 31 + 2 ** 32 + 2 ** 33 + 1);
        expect(Permissions.union(mask, mask)).toBe(mask);
        expect(Permissions.subtract(mask, InviteToCall.value)).toBe(2 ** 31 + 2 ** 33 + 1);
        expect(Permissions.subtract(mask, ManageCalls.value)).toBe(2 ** 31 + 2 ** 32 + 1);
        expect(Permissions.subtract(mask, mask)).toBe(0);
        expect(Permissions.subtract(InviteToCall.value, ManageCalls.value)).toBe(2 ** 32);
        expect(Permissions.union()).toBe(0);
    });
});