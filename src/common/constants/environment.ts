export const DB_HOST = process.env.DB_HOST || 'localhost';

export const DB_NAME = process.env.DB_NAME || 'icollection';

export const DB_USER = process.env.DB_USER || 'root';

export const DB_PASSWORD = process.env.DB_PASSWORD || 'root';

export const DB_PORT = process.env.DB_PORT || 3306;

export const APP_PORT = process.env.PORT || 3000;

export const ACCESS_SECRET = process.env.ACCESS_SECRET || 'ACCESS_SECRET';

export const REFRESH_SECRET_LENGTH = 64;

export const REFRESH_SECRET_MAX_DAYS = process.env.REFRESH_SECRET_MAX_DAYS || 30;
