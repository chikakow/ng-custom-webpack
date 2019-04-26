import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FisReconcileComponent } from './fis-reconcile.component';
import { MyTestComponent } from './my-test/my-test.component';
import { ReprintcheckmanagementComponent } from './reprintcheckmanagement/reprintcheckmanagement.component';


const angular: any = {};
angular.atsServerValues = {};
angular.atsServerValues.companyId = '1';

const routes: Routes = [    

    { path: '', component: FisReconcileComponent, pathMatch: 'full' },
    { path: 'refundmgmt', component: MyTestComponent },
    //{ path: '', redirectTo: 'reconcileaccount/management', pathMatch: 'full' },
    //{ path: 'reconcileaccount/management', component:  MyTestComponent },
    { path: 'reprintcheck/management', component: ReprintcheckmanagementComponent }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class FisReconcileRoutingModule {    
}
