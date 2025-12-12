import { HTTPResponseInterceptor } from '@common/interceptors';
import {
  ClassSerializerInterceptor,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);

  const port = configService.get<string>('app.port');
  const apiVersion = configService.get<string>('app.apiVersion');

  app.setGlobalPrefix(`api/${apiVersion}`);
  app.useGlobalInterceptors(
    new HTTPResponseInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  await app.listen(port!);
}
void bootstrap();
