import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { User } from "src/entities/user.entity";
import * as bcrypt from 'bcrypt';
import { TokenService } from "src/token/token.service";

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService, private tokenService: TokenService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if(user && (await bcrypt.compare(pass, user.password))) {
            const  {password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials!');
    }

    async register(userData: any): Promise<any> {
        const { username } = userData;
        const existingUser = await this.usersService.findByUsername(username);
        if(!existingUser) // Nếu không tồn tại user với username nào
            return this.usersService.create(userData);
        throw new ConflictException(`Username ${username} already exists!`);
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_SECRET,
            expiresIn: '7d',
        });
        const tokenEntity = await this.tokenService.saveRefreshToken(user, refreshToken);
        return { accessToken, refreshToken };
    }

    async refreshToken(refreshTokenFromUser: string) {
        // const payload = this.jwtService.decode(refreshTokenFromUser);
        const payload = this.jwtService.decode(refreshTokenFromUser) as { sub: number };
        
        // Validate payload decoded from refresh token
        if (!payload || typeof payload !== 'object' || !payload.sub) throw new UnauthorizedException('Invalid refresh token');
        const { sub } = payload;
        
        // Validate is token entity exists in DB of userId (sub)
        const tokenEntity = await this.tokenService.findRefreshToken(+sub);
        if(!tokenEntity) throw new NotFoundException('Decoded userId from token have no tokens in DB!');

        // Validate expire token
        if(tokenEntity.expiryDate < new Date()) throw new UnauthorizedException('Refresh token has expired!');

        // Validate refreshToken hashed bcrypt
        const isRefreshToValidHashed = await bcrypt.compare(refreshTokenFromUser, tokenEntity.value);
        if(!isRefreshToValidHashed) throw new UnauthorizedException('Refesh token is not a valid hashed compare!');

        const newPayload = { username: tokenEntity.user.username, sub: tokenEntity.user.id };
        const newAccessToken = this.jwtService.sign(newPayload);
        return { accessToken: newAccessToken };
    }
}