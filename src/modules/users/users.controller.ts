import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { PaginationQueryOptions } from '../../common/utils/query/query-options';
import { UsersService } from './users.service';
import { SelectUserDto } from './dto/select-user.dto';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Resources } from '../../common/constants/authorization';
import { PatchUserDto, patchUserDtoSchema } from './dto/patch-user.dto';
import { NopeValidationPipe } from '../../pipes/nope-validation.pipe';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'read', resource: Resources.USERS, possession: 'any' })
    async findAll(@Query() { page, limit }: PaginationQueryOptions) {
        const users = await this.usersService.findAll(page as number, limit as number);
        const total = await this.usersService.countUsers();
        return {
            total: total,
            data: users.map((u) => new SelectUserDto(u)),
        };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SelectUserDto | null> {
        const user = await this.usersService.findUserById(id);
        if (user) {
            return new SelectUserDto(user);
        }
        throw new NotFoundException();
    }

    @Patch()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'update', resource: Resources.USERS, possession: 'any' })
    @UsePipes(new NopeValidationPipe(patchUserDtoSchema))
    async edit(@Body() patchUserDto: PatchUserDto) {
        const user = await this.usersService.edit(patchUserDto);
        return user;
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: number): Promise<string> {
        await this.usersService.deleteUserById(id);
        return `User with id: ${id} was deleted`;
    }
}
