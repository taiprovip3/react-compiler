import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { Address } from 'src/entities/address.entity';
import { AddressController } from './address.controller';
import { UserModule } from 'src/user-service/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UserModule],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
