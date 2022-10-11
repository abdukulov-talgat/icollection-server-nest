import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { FindManyUsersDto } from './dto/find-many-users.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async createOne(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findMany(@Query() { page, limit }: FindManyUsersDto): Promise<User[]> {
        return this.usersService.findAll(page || 1, limit || 5);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | undefined> {
        return this.usersService.findUserById(id);
    }

    @Patch(':id')
    async patchOne(@Param('id') id: number, @Body() patchUserDto: PatchUserDto): Promise<string> {
        return `Patched user with id: ${id}`;
    }

    @Delete(':id')
    deleteOne(@Param('id') id: number): string {
        return `Delete user with id: ${id}`;
    }
}
