import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Token, TokenType } from "src/entities/token.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "src/entities/user.entity";

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
    ) {}

    async saveRefreshToken(user: User, refreshToken: string): Promise<Token> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        // const refreshToken = await bcrypt.hash(`${user.id}-${Date.now()}`, 10);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // Hết hạn sau 7 ngày
    
        const token = this.tokenRepository.create({
          user,
          type: TokenType.REFRESH,
          value: hashedRefreshToken,
          expiryDate,
        });
        return this.tokenRepository.save(token);
    }

    async findRefreshToken(userId: number): Promise<Token | null> {
        return await this.tokenRepository.findOne({ 
            where: { user: {id: userId}, type: TokenType.REFRESH } ,
            relations: ['user']
        });
    }

    async deleteRefreshToken(value: string): Promise<void> {
        await this.tokenRepository.delete({ value });
    }
}