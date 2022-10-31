import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SelectUserDto } from './dto/select-user.dto';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Resources } from '../../common/constants/authorization';
import { PatchUserDto, patchUserDtoSchema } from './dto/patch-user.dto';
import { NopeValidationPipe } from '../../pipes/nope-validation.pipe';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
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

    @Patch()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'update', resource: Resources.USERS, possession: 'any' })
    @UsePipes(new NopeValidationPipe(patchUserDtoSchema))
    async edit(@Body() patchUserDto: PatchUserDto) {
        return await this.usersService.edit(patchUserDto);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: number): Promise<string> {
        const result = await this.usersService.deleteUserById(id);
        if (result) {
            return `User with id: ${id} was deleted`;
        }
        throw new BadRequestException();
    }
}
