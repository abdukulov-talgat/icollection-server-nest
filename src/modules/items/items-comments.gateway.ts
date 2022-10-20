import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { SelectCommentDto } from './dto/select-comment.dto';
import { AppEvents } from '../../common/constants/app-events';
import { ITEM_COMMENTS_ROOM_BASE } from '../../common/constants/websocket';
import { ItemComment } from './model/item-comment.model';

@WebSocketGateway({ cors: { origin: '*' } })
export class ItemsCommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    @OnEvent(AppEvents.ITEM_COMMENT_CREATE_EVENT)
    handleItemCommentCreate(itemComment: ItemComment) {
        const selectCommentDto = new SelectCommentDto(itemComment);
        const roomId = selectCommentDto.itemId;
        this.server
            .to(`${ITEM_COMMENTS_ROOM_BASE}/${roomId}`)
            .emit(AppEvents.ITEM_COMMENT_CREATE_EVENT, selectCommentDto);
    }

    handleConnection(client: Socket): any {
        client.join(`${ITEM_COMMENTS_ROOM_BASE}/${client.handshake.auth.itemRoomId}`);
    }

    handleDisconnect(client: Socket): any {
        client.leave(`${ITEM_COMMENTS_ROOM_BASE}/${client.handshake.auth.itemRoomId}`);
    }
}
