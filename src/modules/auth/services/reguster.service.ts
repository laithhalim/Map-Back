import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRegistrationDto } from '../dto/userRegistration.dto';
import * as bcrypt from 'bcrypt';
import { CustomResponse } from 'src/utils/custom-response';
import { Error_Constant } from 'src/common/constant/Error-Constant';

@Injectable()
export class RegusterService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

//----------------------------------------- Register User ----------------------------------------------//
  async registerUser(userRegistrationDto: UserRegistrationDto): Promise<boolean> {
    const existingUsername = await this.findByUsername(
      userRegistrationDto.username,
    );
    if (existingUsername) {
      throw new ConflictException(CustomResponse.error(Error_Constant[1],409));
    }

    const lastNameAndFirstName =
      userRegistrationDto.lastName + userRegistrationDto.firstName;
    const existingName = await this.findByLastNameAndFirstName(
      lastNameAndFirstName,
    );
    if (existingName) {
      throw new ConflictException(
        CustomResponse.error(Error_Constant[2],409)
      );
    }

    if (userRegistrationDto.phoneNumber) {
      const existingPhoneNumber = await this.findByPhoneNumber(
        userRegistrationDto.phoneNumber,
      );
      if (existingPhoneNumber) {
        throw new ConflictException(CustomResponse.error(Error_Constant[3],409));
      }
    }

    const newUser = this.userRepository.create({
      ...userRegistrationDto,
      password: await this.hashPassword(userRegistrationDto.password),
    });

    await this.userRepository.save(newUser);
    return true;
  }

  
  async findByUsername(username: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      return undefined;
    }
  }
  
  async findByLastNameAndFirstName(name: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { lastName: name.substring(0, name.length / 2), firstName: name.substring(name.length / 2) },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneOrFail({ where: { phoneNumber } });
    } catch (error) {
      return undefined;
    }
  }
  
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; 
    return bcrypt.hash(password, saltRounds);
  }

}
