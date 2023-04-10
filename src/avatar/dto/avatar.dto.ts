import { IsNotEmpty, IsString } from 'class-validator';

export class AvatarDto {
  @IsString()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  hash: string;

  @IsString()
  @IsNotEmpty()
  file_system_path: string;
}
