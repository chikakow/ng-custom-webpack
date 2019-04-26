import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RefundsService } from '../../refunds.service';

@Component({
  selector: 'app-report-refund-details',
  templateUrl: './report-refund-details.component.html',
  styleUrls: ['./report-refund-details.component.scss']
})
export class ReportRefundDetailsComponent implements OnInit {

    customerDetails: any;
    isOverlayBusy: boolean;
    isOverlayError: boolean; 
    constructor(private httpClient: HttpClient,
    private refundsService: RefundsService) { }
    @Input() public accountNumber: number;
    @Input() public checkNo: number;
    private Subscription: Subscription;
    ngOnInit() {
        this.isOverlayBusy = true;
        this.Subscription = this.refundsService.getcustomerdetailsdataReport(this.accountNumber, this.checkNo)
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.isOverlayError = false;
                this.customerDetails = resp;
            }, error => {
                this.isOverlayBusy = false;
                this.isOverlayError = true;

            });      
    }
}
