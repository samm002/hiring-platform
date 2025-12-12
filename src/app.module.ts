import { envPaths } from '@common/constants';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  appConfig,
  currentEnvuronment,
  databaseConfig,
  validateEnv,
} from './config';
import { AuthModule } from './modules/iam/auth/auth.module';
import { PermissionsModule } from './modules/iam/permissions/permissions.module';
import { RolesModule } from './modules/iam/roles/roles.module';
import { UsersModule } from './modules/iam/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPaths[currentEnvuronment()],
      validate: validateEnv,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database')!,
    }),
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
