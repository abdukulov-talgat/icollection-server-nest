export const DB_HOST = process.env.DB_HOST || 'localhost';

export const DB_NAME = process.env.DB_NAME || 'icollection';

export const DB_USER = process.env.DB_USER || 'root';

export const DB_PASSWORD = process.env.DB_PASSWORD || 'root';

export const DB_PORT = Number.parseInt(process.env.DB_PORT || '3306');

export const APP_PORT = Number.parseInt(process.env.PORT || '3000');

export const ACCESS_SECRET = process.env.ACCESS_SECRET || 'ACCESS_SECRET';

export const REFRESH_SECRET_MAX_DAYS = Number.parseInt(process.env.REFRESH_SECRET_MAX_DAYS || '30');

export const EXPIRED_TOKENS_CLEAR_INTERVAL = Number.parseInt(
    process.env.EXPIRED_TOKENS_CLEAR_INTERVAL || '3600000',
);

export const ELASTIC_CLIENT_ID =
    process.env.ELASTIC_CLIENT_ID ||
    'icollection:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ3YzJiY2QxZjViYTk0ZTE4OWZkMzM5NjFmMWVmZjNkMSQ4NjBhNmNlYTgyZDY0MmEyYWIxNGRhYTAwNDU0YmU5Zg==';

export const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME || 'elastic';

export const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD || 'Dm3nrItEkWfwXyv7VPyFARHS';
