import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { GenderType } from 'src/enums/gender.enum'; // bạn định nghĩa enum này rồi

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // dùng string để gửi ISO date
}
