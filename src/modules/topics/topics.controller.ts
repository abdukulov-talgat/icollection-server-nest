import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { NopeValidationPipe } from '../../pipes/nope-validation.pipe';
import { CreateTopicDto, createTopicDtoSchema } from './dto/create-topic.dto';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AvailableRoles } from '../../common/constants/authorization';
import { EditTopicDto, editTopicDtoSchema } from './dto/edit-topic.dto';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';

@Controller('topics')
export class TopicsController {
    constructor(private topicsService: TopicsService) {}

    @Get()
    findAll() {
        return this.topicsService.findAll();
    }

    @Post()
    @UseGuards(AccessJwtGuard, RoleGuard)
    @Roles(AvailableRoles.ADMIN)
    @UsePipes(new NopeValidationPipe(createTopicDtoSchema))
    async create(@Body() createTopicDto: CreateTopicDto) {
        const topic = await this.topicsService.create(createTopicDto);
        if (!topic) {
            throw new BadRequestException();
        }
        return topic;
    }

    @Put()
    @UseGuards(AccessJwtGuard, RoleGuard)
    @Roles(AvailableRoles.ADMIN)
    @UsePipes(new NopeValidationPipe(editTopicDtoSchema))
    async edit(@Body() editTopicDto: EditTopicDto) {
        const editedTopic = await this.topicsService.edit(editTopicDto);
        if (!editedTopic) {
            throw new BadRequestException();
        }
        return editedTopic;
    }

    @Delete(':id')
    @UseGuards(AccessJwtGuard, RoleGuard)
    @Roles(AvailableRoles.ADMIN)
    async delete(@Param('id', ParseIdPipe) id: number) {
        const count = await this.topicsService.delete(id);
        if (!count) {
            throw new BadRequestException();
        }
        return { result: true, message: `Topic with id ${id} was successfully deleted` };
    }
}
