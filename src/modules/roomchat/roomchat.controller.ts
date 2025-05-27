import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomchatService } from './roomchat.service';
import { CreateRoomchatDto } from './dto/create-roomchat.dto';
import { UpdateRoomchatDto } from './dto/update-roomchat.dto';

@Controller('roomchat')
export class RoomchatController {
  constructor(private readonly roomchatService: RoomchatService) {}

  @Post()
  create(@Body() createRoomchatDto: CreateRoomchatDto) {
    return this.roomchatService.create(createRoomchatDto);
  }

  @Get()
  findAll() {
    return this.roomchatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomchatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomchatDto: UpdateRoomchatDto,
  ) {
    return this.roomchatService.update(+id, updateRoomchatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomchatService.remove(+id);
  }
}
