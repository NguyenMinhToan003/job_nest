import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { GetwayService } from './getway.service';

@WebSocketGateway()
export class GetwayGateway {
  constructor(private readonly getwayService: GetwayService) {}

  @SubscribeMessage('findOneGetway')
  findOne(@MessageBody() id: number) {
    return;
  }
}
