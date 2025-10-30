import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: false }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: cfg.get<string>('NODE_ENV') !== 'production',
        ssl: cfg.get<boolean>('DB_SSL') ? { rejectUnauthorized: false } : false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
