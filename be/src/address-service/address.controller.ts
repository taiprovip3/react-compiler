import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth-service/guards/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/my')
  getUserAddresses(@Request() req) {
    const userId = req.user.id;
    return this.addressService.getUserAddresses(userId);
  }

  @Post()
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.id;
    return this.addressService.create(userId, createAddressDto);
  }

  @Put(':id')
  update(
    @Param('id') addressId: string,
    @Request() req,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const userId = req.user.id;
    return this.addressService.update(+addressId, userId, createAddressDto);
  }

  @Delete(':id')
  delete(@Param('id') addressId: string, @Request() req) {
    const userId = req.user.id;
    return this.addressService.delete(+addressId, userId);
  }
}
