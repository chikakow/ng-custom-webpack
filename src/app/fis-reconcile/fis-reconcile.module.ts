import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import 'angular';
declare const angular: any;
import { UpgradeModule, setAngularJSGlobal } from '@angular/upgrade/static';
import { setUpLocationSync } from '@angular/router/upgrade';

import { FisReconcileComponent } from './fis-reconcile.component';
import { CoreFoundationModule, KendoUiAngularModule } from 'core-foundation';

// import { KendoUiAngularModule } from './shared/modules/kendo-ui-angular/kendo-ui-angular.module';

import { MyTestComponent } from './my-test/my-test.component';
import { FisReconcileRoutingModule } from './fis-reconcile-routing.module';
import { RefundsmanagementModule } from './refundsmanagement/refundsmanagement.module';
import { ReprintcheckmanagementModule } from './reprintcheckmanagement/reprintcheckmanagement.module';
import { ReprintcheckmanagementComponent } from './reprintcheckmanagement/reprintcheckmanagement.component';
import { JournalDirectiveWrapper } from './my-test/journal.directive';

const routes: Routes = [    

    // { path: '', component: FisReconcileComponent },
    // { path: 'mytest', component: MyTestComponent },
    //{ path: '', redirectTo: 'reconcileaccount/management', pathMatch: 'full' },
    //{ path: 'reconcileaccount/management', component:  MyTestComponent },
    { path: 'refunds/management', component: FisReconcileComponent },
    { path: 'reprintcheck/management', component: ReprintcheckmanagementComponent }
];

@NgModule({
    declarations: [
        FisReconcileComponent,
        JournalDirectiveWrapper,
        MyTestComponent
    ],
    providers: [
    ],
    imports: [
        UpgradeModule,
        RouterModule.forChild(routes),
        CoreFoundationModule,
        KendoUiAngularModule,
        FisReconcileRoutingModule,
        RefundsmanagementModule,
        ReprintcheckmanagementModule
    ],
    exports: [  FisReconcileComponent,
                MyTestComponent,
                RefundsmanagementModule,
                ReprintcheckmanagementModule
      ]
})
export class FisReconcileModule { 

    constructor(private upgrade: UpgradeModule) {
        console.log('fis-reconcile bootstrapping');
        upgrade.bootstrap(document.body, ['journalModule']);
        setUpLocationSync(upgrade);
    }
}
