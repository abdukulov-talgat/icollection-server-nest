import { RolesBuilder } from 'nest-access-control';

export const SALT_ROUNDS = 10;

export const ROLE_KEY = 'roles';

export const REFRESH_SECRET_LENGTH = 64;

export enum AvailableRoles {
    ADMIN = 'admin',
    USER = 'user',
}

export enum Resources {
    COLLECTIONS = 'collection',
    ADMIN_PANEL = 'admin',
    TOPICS = 'topics',
    ITEMS = 'items',
    ITEMS_COMMENTS = 'items/comments',
    ITEMS_LIKES = 'items/likes',
}

export const appRoles: RolesBuilder = new RolesBuilder();

appRoles
    .grant(AvailableRoles.USER)
    .createOwn([Resources.COLLECTIONS, Resources.ITEMS])
    .updateOwn([Resources.COLLECTIONS, Resources.ITEMS])
    .deleteOwn([Resources.COLLECTIONS, Resources.ITEMS])
    .readAny([Resources.COLLECTIONS, Resources.ITEMS])
    .grant(AvailableRoles.ADMIN)
    .extend(AvailableRoles.USER)
    .createAny(Object.values(Resources))
    .updateAny(Object.values(Resources))
    .deleteAny(Object.values(Resources))
    .readAny(Object.values(Resources));
