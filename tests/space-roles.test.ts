import {IndexedObjectCollection} from "../src";
import {Role} from "pserv-ts-types";
import {reorderRolesOnPriorityUpdate} from "../src/state-tracker/functions";

const createCollection = () => new IndexedObjectCollection<Role>(
    role => role.id,
    [
        {id: 'id1', name: 'everyone', priority: 0, color: '#ff0000', flags: 0},
        {id: 'id2', name: 'roleA', priority: 1, color: '#ff0000', flags: 0},
        {id: 'id3', name: 'roleB', priority: 2, color: '#ff0000', flags: 0},
        {id: 'id4', name: 'roleC', priority: 3, color: '#ff0000', flags: 0},
        {id: 'id5', name: 'roleD', priority: 4, color: '#ff0000', flags: 0},
    ],
);

test('roles reorder - increase', () => {
    const collection = createCollection();
    const oldRole = collection.get('id2');
    const newRole: Role = {...oldRole, priority: 4};
    const result = reorderRolesOnPriorityUpdate(collection.items, oldRole, newRole);
    collection.set(newRole, ...result);

    //expect(result.length).toBe(3);
    expect(collection.get('id1').priority).toBe(0);
    expect(collection.get('id2').priority).toBe(4);
    expect(collection.get('id3').priority).toBe(1);
    expect(collection.get('id4').priority).toBe(2);
    expect(collection.get('id5').priority).toBe(3);
});

test('roles reorder - decrease', () => {
    const collection = createCollection();
    const oldRole = collection.get('id5');
    const newRole: Role = {...oldRole, priority: 0};
    const result = reorderRolesOnPriorityUpdate(collection.items, oldRole, newRole);
    collection.set(newRole, ...result);

    expect(collection.get('id1').priority).toBe(1);
    expect(collection.get('id2').priority).toBe(2);
    expect(collection.get('id3').priority).toBe(3);
    expect(collection.get('id4').priority).toBe(4);
    expect(collection.get('id5').priority).toBe(0);
});