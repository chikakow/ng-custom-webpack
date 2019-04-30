import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive, ElementRef, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared Modules - includes custom mdules (if any)
import { NgxBootstrapModule } from './shared/modules/ngx-bootstrap/ngx-bootstrap.module';

// Third Party services
import { CookieService } from 'ngx-cookie-service';

// Libraries/Modules
import { MiniPortalModule } from 'mini-portal';

import { CoreFoundationModule, KendoUiAngularModule } from 'core-foundation';

import * as angular from 'angular';
import { downgradeComponent, setAngularJSGlobal, UpgradeComponent, UpgradeModule, downgradeModule } from '@angular/upgrade/static';

// Services
import { httpInterceptorProviders } from './shared/services/http-interceptors';
import { ChromeBarComponent } from './shared/components/layouts/chrome/chrome-bar/chrome-bar.component';
import { CompanyBranchComponent } from './shared/components/layouts/chrome/company-branch/company-branch.component';
import { EmployeeComponent } from './shared/components/layouts/chrome/employee/employee.component';
import { AppListComponent } from './shared/components/layouts/chrome/app-list/app-list.component';
import { NotificationsComponent } from './shared/components/layouts/chrome/notifications/notifications.component';
import { SettingsComponent } from './shared/components/layouts/chrome/settings/settings.component';
import { HistoryComponent } from './shared/components/layouts/chrome/history/history.component';
import { SiteComponent } from './shared/components/layouts/site/site.component';

// import { KendoUiAngularModule } from './shared/modules/kendo-ui-angular/kendo-ui-angular.module';
//import '@progress/kendo-ui';

import { SiteService } from 'core-foundation';
import { RefundsmanagementComponent } from './fis-reconcile/refundsmanagement/refundsmanagement.component';
import { GeneraterefundsComponent } from './fis-reconcile/refundsmanagement/generaterefunds/generaterefunds.component';
import { HeldrefundsComponent } from './fis-reconcile/refundsmanagement/heldrefunds/heldrefunds.component';
import { PotentialrefundsComponent } from './fis-reconcile/refundsmanagement/potentialrefunds/potentialrefunds.component';
import { RefundchecksreportComponent } from './fis-reconcile/refundsmanagement/refundchecksreport/refundchecksreport.component';
import { ReportrefundsComponent } from './fis-reconcile/refundsmanagement/reportrefunds/reportrefunds.component';
import { RefundsmanagementModule } from './fis-reconcile/refundsmanagement/refundsmanagement.module';

(function () {
    'use strict';
    
    //angular.
        //module('journalModule',[])
        //.service("libatsJournalService", [function () {
        //    function getSampleConsole() {
        //        return ("console data came from service");
        //    }
        //}])
        //.component('libatsJournal', {
        //    template: 'Text for journal here'
        //})
        //.component('libatsJournal', {
        //    bindings: {
        //        model: '<'
        //    },
        //    controller: function () { console.log("Hello World!"); },
        //    template: 'Text for journal here',
        //    restrict: 'E'
        //})
       // .directive('appRoot', downgradeComponent({ component: AppComponent }));

    //controllerFunc.$inject = ['libatsJournalService'];
    //function controllerFunc(libatsJournalService) {
    //    let con = libatsJournalService.getSampleConsole();
    //    console.log(con);
    //}
})();

// .directive('recFisReconcile', downgradeComponent({ component: FisReconcileComponent }))

//@Directive({
//    selector: 'my-example'
//})
//export class MyExampleDirective extends UpgradeComponent {
//    constructor(elementRef: ElementRef, injector: Injector) {
//        super('myExample', elementRef, injector);
//    }
//}

@NgModule({

    declarations: [
        AppComponent,
        ChromeBarComponent,
        CompanyBranchComponent,
        EmployeeComponent,
        AppListComponent,
        NotificationsComponent,
        SettingsComponent,
        HistoryComponent,
        SiteComponent,

        // , MyExampleDirective
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
       RefundsmanagementModule,
        // we want to get away from angular routing
        // AppRoutingModule,
        HttpClientModule,
        FormsModule,

        // Shared Modules in app
        NgxBootstrapModule,
        KendoUiAngularModule,

        // Libraries/Modules
        CoreFoundationModule,
        MiniPortalModule,
       // FisReconcileModule,
        // PDFExportModule,
    ],
    providers: [
        CookieService,
        httpInterceptorProviders   // barrel file for interceptors
        , // register AngularJS services here
        {
            provide: 'kendo.directives',
            useFactory: ($injector: any) => $injector.get('kendo.directives'),
            deps: ['$injector']
        },
    ]
    // normally below should be: bootstrap: [AppComponent]
    , bootstrap: [
        AppComponent,
        RefundsmanagementComponent
    ]
    , schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
    constructor(
   
    ) {
        debugger;
    }

    ngDoBootstrap() {
        debugger;
    }

    // ngDoBootstrap() {
      //  setAngularJSGlobal(angular);
        //let script = document.createElement('script');
        //script.type = 'text/javascript';

        ////let angular: any = {};
        //angular.atsServerValues = {};
        //// add more as needed
        //angular.atsServerValues.enforceNamingConventions = {};
        //angular.atsServerValues.enforceSettings = {};
        //angular.atsServerValues.locale = {};
        //angular.atsServerValues.enforceSettings.enforceUseOfAtsDisabled = {};

        // script.innerText = "angular.atsServerValues = " + JSON.stringify(angular.atsServerValues);

        //let url: string = "../../api/layouts/site/miniportal/getminiportalviewmodel/1";
        //this.siteService.getAngularObject(url).subscribe((data: any) => {

        //    // this.scriptService.setAngularData(data);
        //    //window['angular'] = this.angular;

        //    let script = document.createElement('script');
        //    script.type = 'text/javascript';
        //    script.innerText = "angular.atsServerValues = " + JSON.stringify(data.atsServerValues);   //"var angularString = '" + JSON.stringify(data) + "';" + " var angular = JSON.parse(angularString);";
        //    document.getElementsByTagName('head')[0].appendChild(script);

        //    this.scriptService.loadFoundationScripts().then(data => {
        //        console.log('script loaded ', data);
        //        angular.module('journalModule')
        //            .directive('appRoot', downgradeComponent({ component: AppComponent }));
        //        this.upgrade.bootstrap(document.body, ['journalModule']);
        //        // default routing does not work when using entryComponents and ngDoBootstrap
        //        // please refer to url: https://github.com/angular/angular/issues/26897
        //        this.router.initialNavigation();

        //    }).catch(error => console.log(error));

        //    //this.scriptService.loadFoundationScripts();

        //    console.log('script loaded ', data);
        //    angular.module('journalModule')
        //        .directive('appRoot', downgradeComponent({ component: AppComponent }));
        //    this.upgrade.bootstrap(document.documentElement, ['journalModule']);
        //    // default routing does not work when using entryComponents and ngDoBootstrap
        //    // please refer to url: https://github.com/angular/angular/issues/26897
        //    this.router.initialNavigation();
        //});

        //angular.module('journalModule')
        //    .directive('appRoot', downgradeComponent({ component: AppComponent }));
        //this.upgrade.bootstrap(document.documentElement, ['journalModule']);
        //// default routing does not work when using entryComponents and ngDoBootstrap
        //// please refer to url: https://github.com/angular/angular/issues/26897
        //this.router.initialNavigation();



        
        
        
   //  }
}
