import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReprintcheckmanagementComponent } from './reprintcheckmanagement.component';
import { CoreFoundationModule, KendoUiAngularModule } from 'core-foundation';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlgnJournalModule } from 'plgn-journal';

const routes: Routes = [
    {
        path: '', component: ReprintcheckmanagementComponent,
        children: [
            { path: '', loadChildren: '../refundsmanagement/generaterefunds/generaterefunds.module#GenerateRefundsModule', pathMatch: 'full' },
            { path: 'generaterefunds', loadChildren: '../refundsmanagement/generaterefunds/generaterefunds.module#GenerateRefundsModule', pathMatch: 'full' },
            { path: 'heldrefunds', loadChildren: '../refundsmanagement/heldrefunds/heldrefunds.module#HeldFundsRefundsModule' }
        ]
    }
];

@NgModule({
  declarations: [ReprintcheckmanagementComponent],
  imports: [
      RouterModule.forChild(routes),
      CommonModule,
      FormsModule,
      KendoUiAngularModule,
      CoreFoundationModule,
      PlgnJournalModule
    ],
    exports:[ReprintcheckmanagementComponent]

})
export class ReprintcheckmanagementModule { }
