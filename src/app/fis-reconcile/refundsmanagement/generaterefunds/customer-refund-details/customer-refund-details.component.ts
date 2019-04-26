import { Component, OnInit, Input} from '@angular/core';
import { Subscription } from 'rxjs';
import { RefundsService } from '../../refunds.service';
import { AtsI18nService } from 'core-foundation';

@Component({
    selector: 'app-customer-refund-details',
    templateUrl: './customer-refund-details.component.html',
    styleUrls: ['./customer-refund-details.component.scss']
})
export class CustomerRefundDetailsComponent implements OnInit {
    customerDetails: any;
    private subscription: Subscription;
    isOverlayBusy: boolean;
    isOverlayError: boolean;
  
    constructor(  private refundsService: RefundsService,
                  private atsI18nService:AtsI18nService
               ) { }
    @Input() public accountNumber: number;

    ngOnInit() {
        this.getDetails();
    }

    getDetails() {
        this.isOverlayBusy = true;
        this.subscription = this.refundsService.getcustomerdetailsdata(this.accountNumber)
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.customerDetails = resp;
                this.atsI18nService.initI18nJson(this.customerDetails); 
            }, error => {
                this.isOverlayError = true;
            })
    }

    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }
}