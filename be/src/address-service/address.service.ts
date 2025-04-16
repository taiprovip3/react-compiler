import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/address.entity';
import { User } from 'src/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UserService } from 'src/user-service/user.service';
import { relative } from 'path';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    // TH1: User chưa có profile
    // TH2: User chưa có default address
    // TH3: save failed - internal server err
    const profile = await this.userService.getProfile(userId);
    if (!profile) {
      throw new NotFoundException(
        `User ${userId} has no profile yet. Please update infomation and turn back again!`,
      );
    }

    if (!profile.defaultAddress) {
      console.warn(
        `User ${userId} has no default address yet. Consider doing somethings!`,
      );
    }

    const addressObj = this.addressRepository.create({
      ...createAddressDto,
      profile,
    });
    return this.addressRepository.save(addressObj);
  }

  async update(
    addressId: number,
    userId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    // TH1: user ko có profile, cố tình bug call api update address id
    // TH2: ko có address nào tồn tại by id
    // TH3: save failed - internal server err

    const profile = await this.userService.getProfile(userId);
    if (!profile) {
      throw new NotFoundException(
        `User ${userId} has no profile yet. Are you trying to bug us?!`,
      );
    }

    const addressObj = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['profile'],
    });

    if (!addressObj || addressObj.profile.id !== profile.id) {
      throw new NotFoundException('Address not found or unauthorized');
    }

    Object.assign(addressObj, createAddressDto);
    return this.addressRepository.save(addressObj);
  }

  async getUserAddresses(userId: number): Promise<Address[]> {
    const addresses = await this.addressRepository.find({
      where: { profile: { user: { id: userId } } },
    });
    return addresses;
  }

  async delete(addressId: number, userId: number): Promise<DeleteResult> {
    const profile = await this.userService.getProfile(userId);
    if (!profile) {
      throw new NotFoundException(
        `User ${userId} has no profile yet. Are you trying to bug us?!`,
      );
    }

    const addressObj = await this.addressRepository.findOne({
      where: { id: addressId },
      relations: ['profile'],
    });
    if (!addressObj || addressObj.profile.id !== profile.id) {
      throw new NotFoundException('Address not found or unauthorized');
    }

    return this.addressRepository.delete(addressObj);
  }
}
