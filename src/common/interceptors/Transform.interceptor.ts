// src/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Interceptor agindo antes de gerenciar o request');
        return next.handle().pipe(map(data => {
            console.log('Interceptor agindo após gerenciar o request');
            return {
                dadosTransformados: data,
            };
        }));
    }
}