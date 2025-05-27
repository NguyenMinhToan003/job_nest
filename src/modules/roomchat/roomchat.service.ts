import { Injectable } from '@nestjs/common';
import { CreateRoomchatDto } from './dto/create-roomchat.dto';
import { UpdateRoomchatDto } from './dto/update-roomchat.dto';

@Injectable()
export class RoomchatService {
  create(createRoomchatDto: CreateRoomchatDto) {
    return 'This action adds a new roomchat';
  }

  findAll() {
    return `This action returns all roomchat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomchat`;
  }

  update(id: number, updateRoomchatDto: UpdateRoomchatDto) {
    return `This action updates a #${id} roomchat`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomchat`;
  }
}
