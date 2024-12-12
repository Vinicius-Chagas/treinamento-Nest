// src/pipes/example.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';

@Injectable()
export class ExamplePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNaN(value)) {
      const transform = Number(value)
      if (isNaN(transform)) {
        throw new BadRequestException('Validação falhou');
      }
    }
    return value;
  }
}