import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

    constructor() { }

    add(msg: any) {
        console.log(msg);
    }
}
