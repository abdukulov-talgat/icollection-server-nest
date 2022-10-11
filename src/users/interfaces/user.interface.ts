export interface User {
    id: number;
    email: string;
    passwordHash: string;
    isBanned: boolean;
}
