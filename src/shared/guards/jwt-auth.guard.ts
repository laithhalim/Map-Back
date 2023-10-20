import { Injectable, ExecutionContext, UnauthorizedException,Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from "cache-manager";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException('Unauthorized. Please log in.');
    }

    const token = authorizationHeader.replace('Bearer ', '');

    try {
      let payload =this.jwtService.verify(token);
      const CacheValue = await this.cacheManager.get(`${payload?.id}`);
      if(CacheValue===token){
        req.user = payload; 
      }else{
        throw new Error('Invalid token. Please log in again.')
      }

    } catch (e) {
      throw new UnauthorizedException('Invalid token. Please log in again.');
    }

    return true;
  }
}
