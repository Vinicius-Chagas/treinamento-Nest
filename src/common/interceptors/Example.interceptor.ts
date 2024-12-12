// src/interceptors/example.interceptor.ts
import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ExampleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Interceptor agindo antes de gerenciar o request');
    return next.handle().pipe(
      tap(() => console.log('Interceptor agindo após gerenciar o request request')),
    );
  }
}