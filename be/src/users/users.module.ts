import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { Authority } from 'src/entities/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authority])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
