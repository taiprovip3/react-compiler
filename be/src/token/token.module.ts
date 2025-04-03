import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entities/token.entity';
import { TokenService } from './token.service';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    controllers: [],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule {}
