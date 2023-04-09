import {
  Controller,
  Param,
  Response,
  Get,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { downloadFile } from 'src/helpers/download-file.helper';
import { UsersRepository } from './repository/users.repository';
import { AvatarRepository } from '../avatar/repository/avatar.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAvatarDto } from '../avatar/dto/create-avatar.dto';
import { UsersService } from './services/users.services';
import * as fs from 'fs';

@Controller('api/user')
export class UsersController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private userService: UsersService,
    private avatarRepository: AvatarRepository,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Get(':id/avatar')
  async findAvatar(@Param('id') id: number) {
    const avatar = await this.avatarRepository.findOneByUserId(id);

    if (!avatar?.user_id) {
      const user = await this.userService.getUser(id).toPromise();
      const imagePath = `./static/${user.id}.jpg`;

      await downloadFile(user.avatar, imagePath);

      const base64Image = fs.readFileSync(imagePath, 'base64');
      const parsedBase64Image = `data:image/jpg;base64,${base64Image}`;

      const avatar: CreateAvatarDto = {
        file_system_path: imagePath,
        user_id: user.id,
        hash: parsedBase64Image,
      };
      return this.avatarRepository.create(avatar);
    }

    return avatar;
  }

  @Delete(':id/avatar')
  async remove(@Param('id') id: number, @Response() response) {
    const avatar = await this.avatarRepository.findOneByUserId(id);

    if (!avatar) {
      return response.status(404).send({
        message: 'Invalid avatar information, please try again!',
      });
    }

    fs.unlinkSync(avatar.file_system_path);

    this.avatarRepository.removeByUserId(id);

    return response.status(204).send('');
  }
}
