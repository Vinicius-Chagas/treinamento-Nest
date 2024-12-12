import { Body, Controller, Get, Post, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { TransformInterceptor } from './common/interceptors/Transform.interceptor';
import { ExamplePipe } from './common/pipes/examplepipe.pipe';
import { ExampleFilter } from './common/exceptions/http-exception-filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('interceptor')
  @UseInterceptors(TransformInterceptor)
  testInterceptor() {
    console.log('Gerenciador de request')
    return { message: 'Dados originais' };
  }

  @Post('pipe')
  @UsePipes(ExamplePipe)
  testPipe(@Body('value') value: number) {
    return { result: value * 2 };
  }

  @Get('error')
  testEndpoint() {
    throw new Error('Erro não gerenciado.');
  }
}

