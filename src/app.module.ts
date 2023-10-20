import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { parse } from 'url'; 
import { LocationModule } from './modules/locations/location.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        const dbConfig = parse(dbUrl, true);

        return {
          type: 'postgres',
          host: dbConfig.hostname,
          port: Number(dbConfig.port),
          username: dbConfig.auth.split(':')[0],
          password: dbConfig.auth.split(':')[1],
          database: dbConfig.pathname.slice(1),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get<boolean>('DB_SYNC'),
        };
      },
    }),
    AuthModule,
    LocationModule
  ],
})
export class AppModule {}
