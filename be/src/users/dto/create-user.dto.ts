import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @MinLength(8)
    password: string;
    @IsOptional()
    @IsEmail()
    email: string;
}