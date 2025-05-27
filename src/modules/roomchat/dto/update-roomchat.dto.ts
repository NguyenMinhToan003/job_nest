import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomchatDto } from './create-roomchat.dto';

export class UpdateRoomchatDto extends PartialType(CreateRoomchatDto) {}
