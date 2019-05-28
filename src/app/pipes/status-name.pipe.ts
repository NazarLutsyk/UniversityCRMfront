import { Pipe, PipeTransform } from '@angular/core';
import {ClientStatus} from '../models/client-status';

@Pipe({
  name: 'statusName'
})
export class StatusNamePipe implements PipeTransform {

  transform(value: ClientStatus[], statusId: number): any {
    let result;
    result = value.filter(el =>  el.id === statusId);
    if (result[0]) {
      return result[0].name;
    }
    return 'no name';
  }

}
