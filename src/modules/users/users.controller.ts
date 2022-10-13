import {
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { UsersService } from './users.service';
import { SelectUserDto } from './dto/select-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async findMany(@Query() { page, limit }: FindManyUsersDto): Promise<SelectUserDto[]> {
        const users = await this.usersService.findAll(page || 1, limit || 5);
        return users.map((u) => new SelectUserDto(u));
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SelectUserDto | null> {
        const user = await this.usersService.findUserById(id);
        if (user) {
            return new SelectUserDto(user);
        }
        throw new NotFoundException();
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: number): Promise<string> {
        await this.usersService.deleteUserById(id);
        return `User with id: ${id} was deleted`;
    }
}
