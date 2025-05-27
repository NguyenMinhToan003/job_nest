import { Module } from '@nestjs/common';
import { RoomchatService } from './roomchat.service';
import { RoomchatController } from './roomchat.controller';

@Module({
  controllers: [RoomchatController],
  providers: [RoomchatService],
})
export class RoomchatModule {}
