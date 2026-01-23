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