import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
} from '@nestjs/common';

/********************TEMPORARY********************************/
class ListAllEntities {
    limit: number;
    page: number;
}

class PatchDto {
    isBanned: boolean;
    role: string;
}

/***************************************************************/

@Controller('users')
export class UsersController {
    @Get()
    findMany(@Query() query: ListAllEntities): string {
        return `Fine Many of all users. Limit: ${query.limit}. Page: ${query.page}`;
    }

    @Get(':id')
    findOne(@Param('id') id: number): string {
        return `Fine One User with id: ${id}`;
    }

    @Patch(':id')
    patchOne(@Param('id') id: number, @Body() patchDto: PatchDto): string {
        return `Patched user with id: ${id}`;
    }

    @Delete(':id')
    deleteOne(@Param('id') id: number): string {
        return `Delete user with id: ${id}`;
    }
}
