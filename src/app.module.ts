import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import typeorm from './config/typeorm/data-source';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './middleware/logs.middleware';
import { TransformInterceptor } from './common/interceptors/Transform.interceptor';
import { ExampleFilter } from './common/exceptions/http-exception-filter';
import { ExamplePipe } from './common/pipes/examplepipe.pipe';
import { ExampleInterceptor } from './common/interceptors/Example.interceptor';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      dest: '../uploads',
      limits: { fileSize: 10 * 1048576 }, // 10MB
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    UsersModule,
    AuthModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService, TransformInterceptor, ExampleFilter, ExamplePipe, ExampleInterceptor],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
