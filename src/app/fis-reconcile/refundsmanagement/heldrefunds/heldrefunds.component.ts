import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SiteService,AtsI18nService } from 'core-foundation';
import { RefundsService } from '../refunds.service';
import { RowClassArgs } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-heldrefunds',
  templateUrl: './heldrefunds.component.html',
    styleUrls: ['./heldrefunds.component.scss'],
    encapsulation: ViewEncapsulation.None     
})
export class HeldrefundsComponent implements OnInit {
    private subscription: Subscription;  
    isOverlayBusy: boolean = true;
    isOverlayError: boolean;
    heldRefundsData: any;
    date: any;
    node: any;
    showPDF: boolean = false;
    refundsManagement: any;
    public pageSize = 10; 
    public pageSizes; 
    constructor(
               private refundsService: RefundsService,
               private siteService: SiteService,
               private atsI18nService: AtsI18nService 

    ) { }  

    ngOnInit() {      
        this.refundsManagement = this.siteService.getSiteJson().constants.i18n.refundsmanagement;
        this.subscription = this.refundsService.getheldrefunds()
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.heldRefundsData = resp;
                this.pageSizes = [
                    { text: 'All', value: this.heldRefundsData.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];
            }, error => {
                this.isOverlayError = true;
                this.isOverlayBusy = false;
            })

        this.node = this.siteService;
        this.node = this.node.site.constants.enums.refundsmanagement.NodeEnum.HeldMemberRefunds;
        this.atsI18nService.initI18nJson(this.refundsManagement);
    }
   
    public togglePDF(): void {
        this.showPDF = !this.showPDF;
    }

    public rowCallback(context: RowClassArgs) {
        const isEven = context.index % 2 == 0;
        return {
            even: isEven,
            odd: !isEven
        }
    }
    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }
}
