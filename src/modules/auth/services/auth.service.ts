import { Injectable, UnauthorizedException,Inject,BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from "cache-manager";
import { CustomResponse } from 'src/utils/custom-response';
import { Error_Constant } from 'src/common/constant/Error-Constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    //----------------------------------- Login -----------------------------------------------------------//
    async findByUsername(username: string): Promise<User | undefined> {
      try {
        return await this.userRepository.findOneOrFail({ where: { username } });
      } catch (error) {
        return undefined;
      }
    }

    async validateUser(username: string, password: string): Promise<User | null> {
      const user = await this.findByUsername(username);
      if(!user){
        throw new BadRequestException(CustomResponse.error(Error_Constant[4],400))
      }else{
        if(bcrypt.compareSync(password, user.password)){
          return user;
        }else{
          throw new BadRequestException(CustomResponse.error(Error_Constant[5],400))
        }
      }
    }
  
  
    async generateAccessToken(user: User): Promise<string> {
      const accessToken = await this.jwtService.signAsync({ id: user.id, username: user.username,role:user.role,userTypeId:user.userTypeId });
      const ONE_DAY_IN_SECONDS = 24 * 60 * 30;
      await this.cacheManager.set(`${user.id}`, `${accessToken}`,ONE_DAY_IN_SECONDS);
      
      return accessToken;  
    }


    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
      await this.userRepository.update({ id: userId }, { refreshToken });
    }  
  
    async generateRefreshToken(user: User): Promise<string> {
      const refreshToken = await this.jwtService.signAsync({ id: user.id},{
        expiresIn: '30d',  // 30 days for refresh token
      });
      await this.updateRefreshToken(user.id, refreshToken);
      return refreshToken;
    }
  

  //------------------------------- Refresh Token -----------------------------------------------------//

  async findById(id: number): Promise<User | undefined> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return undefined;
    }
  }

  async getRefreshToken(req:any):Promise<string>{
    const { refreshToken } = req.body;
    const userAccessToken = req.headers.authorization;
    if (!userAccessToken) {
      throw new UnauthorizedException(CustomResponse.error('Unauthorized User', 401));
    }

    try {
      const token = userAccessToken.replace('Bearer ', '');
      const payload = this.jwtService.verify(token);


      if (!payload?.id) {
        throw new UnauthorizedException(CustomResponse.error('Invalid token', 401));
      }

      const userId:number = await this.cacheManager.get(`${payload.id}`);

      if (!userId) {
        throw new UnauthorizedException(CustomResponse.error('User not found', 401));
      }


      const user = await this.findById(payload.id);

      if (!user) {
        throw new UnauthorizedException(CustomResponse.error('User not found in database', 401));
      }

      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException(CustomResponse.error('Refresh token mismatch', 401));
      }

      let generateNewAcsessToken=this.generateAccessToken(user);
      return generateNewAcsessToken

  }catch(err){
    throw new UnauthorizedException(CustomResponse.error('Invalid token', 401));
  }

}


async removeRefreshToken(userId: number): Promise<void> {
  try {
      await this.userRepository.update({ id: userId }, { refreshToken: null });
  } catch (error) {
      throw error;
  }
}


}
