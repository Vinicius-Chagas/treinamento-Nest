import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import typeorm from './config/typeorm/data-source';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import LogsMiddleware from './middleware/logs.middleware';
import { DatabaseModule } from './database/database.module';

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
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
