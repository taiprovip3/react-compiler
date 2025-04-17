import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Authority } from 'src/entities/authority.entity';
import { AuthModule } from 'src/auth-service/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Authority]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
