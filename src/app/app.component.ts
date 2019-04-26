import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ClientApp';

    ngOnInit() {
        console.log('app component');
    }
    onActivate(event): void {
        console.log(event);         // Sample Output when you visit ChildComponent url
        console.log(event.title);   // 'hi' 
    }
}
