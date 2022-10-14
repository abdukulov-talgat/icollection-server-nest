declare namespace NodeJS {
    export interface ProcessEnv {
        DB_HOST?: string;
        DB_NAME?: string;
        DB_USER?: string;
        DB_PASSWORD?: string;
        DB_PORT?: string;
        PORT?: string;
        ACCESS_SECRET?: string;
        REFRESH_SECRET_MAX_DAYS?: string;
        EXPIRED_TOKENS_CLEAR_INTERVAL?: string;
    }
}
