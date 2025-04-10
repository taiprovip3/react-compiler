import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TokenModule } from './token-service/token.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth-service/auth.module';
import { UserModule } from './user-service/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UserModule,
    TokenModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
