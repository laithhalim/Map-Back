import { Controller, Post, Body, UnauthorizedException,Request,Inject,Get, BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegistrationDto } from '../dto/userRegistration.dto';
import { RegusterService } from '../services/reguster.service';
import { CustomResponse } from 'src/utils/custom-response';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly RegusterService: RegusterService,
    ){}

  @Post('register')
    async register(@Body() userRegistrationDto: UserRegistrationDto) {
      const result = await this.RegusterService.registerUser(userRegistrationDto);
      return CustomResponse.success(result, 'User registered successfully');  
  }

  @Post('login')
  async login(@Request() req) {
    const { username, password } = req.body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new  UnauthorizedException(CustomResponse.error('Invalid credentials.',401) );
    }
    await this.authService.generateRefreshToken(user);
    delete user.password;
    user['accessToken']=await this.authService.generateAccessToken(user);
    user['refreshToken']=await this.authService.generateRefreshToken(user);

    return CustomResponse.success(user);  

  }

  @Post('refresh-token')
  async refreshToken(@Request() req) {
    let Data=await this.authService.getRefreshToken(req);
    return CustomResponse.success(Data,'Create New Acsess Token')
  }

  @Post('logout')
  async logout(@Request() req) {
      try {
          const userId = req.body.id; 
          await this.authService.removeRefreshToken(userId);
          return CustomResponse.success(null, 'Logged out successfully');
      } catch (error) {
          throw new BadRequestException('Failed to log out');
      }
  }
    
}
