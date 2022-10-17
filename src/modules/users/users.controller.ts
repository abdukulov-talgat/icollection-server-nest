import {
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Query,
    UsePipes,
} from '@nestjs/common';
import { PaginationQueryOptions } from '../../common/utils/query/query-options';
import { UsersService } from './users.service';
import { SelectUserDto } from './dto/select-user.dto';
import { PaginationPipe } from '../../pipes/pagination.pipe';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    async findAll(@Query() { page, limit }: PaginationQueryOptions): Promise<SelectUserDto[]> {
        const users = await this.usersService.findAll(page as number, limit as number);
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
