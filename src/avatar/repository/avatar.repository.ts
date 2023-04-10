import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvatarDto } from '../dto/avatar.dto';
import { Avatar, AvatarDocument } from '../schemas/avatar.schema';

@Injectable()
export class AvatarRepository {
  constructor(
    @InjectModel(Avatar.name)
    private readonly avatarModel: Model<AvatarDocument>,
  ) {}

  async create(avatarDto: AvatarDto): Promise<AvatarDocument> {
    const avatar = new this.avatarModel(avatarDto);
    return avatar.save();
  }

  findOneByUserId(userId: number) {
    return this.avatarModel.findOne({ user_id: userId });
  }

  async removeByUserId(id: number): Promise<AvatarDocument> {
    return this.avatarModel.findOneAndRemove({ user_id: id });
  }
}
