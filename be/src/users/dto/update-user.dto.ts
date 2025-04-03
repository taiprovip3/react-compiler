import { IsBoolean, IsEmail, IsOptional, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;
    @IsOptional()
    @MinLength(8)
    password?: string;
    @IsOptional()
    isDisabled?: boolean;
}