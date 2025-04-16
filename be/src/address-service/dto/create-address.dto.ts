import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  @IsNotEmpty()
  @IsString()
  countryCode: string;
  @IsNotEmpty()
  @IsString()
  address: string;
}
