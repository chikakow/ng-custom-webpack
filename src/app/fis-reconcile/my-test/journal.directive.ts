import { Directive, ElementRef, Injector, Input, OnInit } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

//import '@progress/kendo-ui';
//import 'jquery';
//import 'bootstrap';
//import angular from 'angular';

//import 'wwwroot/ext-src/libs-extensions/angular/angular.js';
//import 'wwwroot/ext-src/libs-extensions/angular/module.js';

@Directive({
    //selector: 'libats-journal'
    // selector:'journalats-journal-modal'
    selector: 'my-journal-directive'
})
export class JournalDirectiveWrapper
    extends UpgradeComponent
    implements OnInit {

    //@Input() model;
    //@Input() overlay;
    //@Input() isBusy;
    //@Input() context;

    constructor(elementRef: ElementRef, _injector: Injector) {
        const rootScope = _injector.get('$rootScope');
        const scope = rootScope.$new();
        const injector = Injector.create([
            {
                provide: '$scope',
                useValue: scope
            }
        ], _injector);

        // super('ng1Component`, _elRef, injector);

        super('myJournalDirective', elementRef, injector);

        console.log("myJournalDirective typescript constructor fired");
    }

    ngOnInit() {
        super.ngOnInit();
    }

}
