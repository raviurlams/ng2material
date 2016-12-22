import {Pipe, PipeTransform} from '@angular/core';

// # Filter Array of Objects
@Pipe({ name: 'filter' })

export class FilterArrayPipe implements PipeTransform {
  transform(value, args) {
    if (!args) {
      return value;
    } else if (value) {
      return value.filter(function (value) {
        return (value['fname'].toUpperCase().includes(args.toUpperCase()) ||
          value['lname'].toUpperCase().includes(args.toUpperCase()) ||
          value['city'].toUpperCase().includes(args.toUpperCase())  ||
          value['state'].toUpperCase().includes(args.toUpperCase()) ||
          value['zip'].toString().includes(args.toString())
        );
      });
    }
  }
}

   