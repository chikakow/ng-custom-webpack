import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RefundsmanagementComponent } from './refundsmanagement.component';
import { HeldrefundsComponent } from './heldrefunds.component';
//import { CustomerRefundDetailsComponent } from './generaterefunds/customer-refund-details/customer-refund-details.component';
import { FormsModule } from '@angular/forms';
//import { HeldrefundsComponent } from './heldrefunds/heldrefunds.component';
//import { JournalComponent } from './journal/journal.component';
//import { PotentialrefundsComponent } from './potentialrefunds/potentialrefunds.component';
//import { RefundchecksreportComponent } from './refundchecksreport/refundchecksreport.component';
//import { ReportrefundsComponent } from './reportrefunds/reportrefunds.component';
//import { ReportRefundDetailsComponent } from './reportrefunds/report-refund-details/report-refund-details.component';
import { CoreFoundationModule, KendoUiAngularModule } from 'core-foundation';
import { PlgnJournalModule } from 'plgn-journal';

import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: '', component: HeldrefundsComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [
    //RefundsmanagementComponent,
    //GeneraterefundsComponent,
    //CustomerRefundDetailsComponent,
    HeldrefundsComponent,
    //JournalComponent,
    //PotentialrefundsComponent,
    //RefundchecksreportComponent,
    //ReportrefundsComponent,
    //  ReportRefundDetailsComponent,
    //  JournalDirectiveWrapper,
  ],

    imports: [
        RouterModule.forChild(routes),
        CommonModule,
    FormsModule,
    KendoUiAngularModule,
    CoreFoundationModule,
        PlgnJournalModule
  ],
  exports: [
    //RefundsmanagementComponent,
    
    //CustomerRefundDetailsComponent,
    //HeldrefundsComponent,
    //JournalComponent,
    //PotentialrefundsComponent,
    //RefundchecksreportComponent,
    //ReportrefundsComponent,
    //ReportRefundDetailsComponent,
    KendoUiAngularModule,
    PlgnJournalModule
  ]
})
export class HeldFundsRefundsModule {

    
}
