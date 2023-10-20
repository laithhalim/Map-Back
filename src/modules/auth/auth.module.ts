import { Module } from '@nestjs/common';
import { AuthController } from '../auth/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RegusterService } from './services/reguster.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '.5h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RegusterService],
  exports: [JwtModule],
})
export class AuthModule {}
