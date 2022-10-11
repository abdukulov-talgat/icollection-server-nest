import { User } from './interfaces/user.interface';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    private nextId = 0;
    private readonly users: User[] = [];

    create({ email, password }: CreateUserDto) {
        const user: User = {
            id: ++this.nextId,
            email,
            passwordHash: password,
            isBanned: false,
        };
        this.users.push(user);
        return user;
    }

    findAll(page: number, limit: number) {
        const start = (page - 1) * limit;
        return this.users.slice(start, start + limit);
    }

    findUserById(id: number) {
        const res = this.users.find((u) => u.id === id);
        console.log(this.users);
        return res;
    }
}
