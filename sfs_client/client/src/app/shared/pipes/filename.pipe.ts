import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {

  transform(value: string): string {
    return value.split('/').pop();
  }
}
