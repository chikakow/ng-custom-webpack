import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { MiniPortalComponent } from 'mini-portal';
// import { FisReconcileComponent } from '@fis-reconcile/public_api';
import { FisReconcileModule } from './fis-reconcile/fis-reconcile.module';

const angular: any = {};
angular.atsServerValues = {};
angular.atsServerValues.companyId = '1';

const routes: Routes = [
    { path: '', redirectTo: '/company/:companyId', pathMatch: 'full' },
    { path: 'company/:companyId', component: MiniPortalComponent },
    { path: 'company/:companyId/refunds/management', loadChildren: './fis-reconcile/refundsmanagement/refundsmanagement.module#RefundsmanagementModule' },
    { path: 'company/:companyId/reprintcheck/management', loadChildren: './fis-reconcile/reprintcheckmanagement/reprintcheckmanagement.module#ReprintcheckmanagementModule' }

    
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
