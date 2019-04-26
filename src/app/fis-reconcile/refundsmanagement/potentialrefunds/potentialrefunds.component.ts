import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SiteService,AtsI18nService } from 'core-foundation';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { RefundsService } from '../refunds.service';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';
@Component({
    selector: 'app-potentialrefunds',
    templateUrl: './potentialrefunds.component.html',
    styleUrls: ['./potentialrefunds.component.scss'],
    encapsulation: ViewEncapsulation.None 
})
export class PotentialrefundsComponent implements OnInit {

    private subscription: Subscription;  
    id: any;  
    popupAlign: any = { horizontal: "right", vertical: "top" };
    potentialRefundView: any[];
    potentialRefundsData: any[];
    potentialRefundCount: number = 0;
    isOverlayBusy: boolean = true;
    isOverlayError: boolean;
    checkAllPotentialRefund: boolean = false;
    node: any;
    showPDF: boolean = false;
    refundsManagement: any;
    public pageSize = 10;
    public pageSizes;
    constructor(
        private siteService: SiteService,
        private refundsService: RefundsService,
        private atsI18nService: AtsI18nService
    ) { }   

    //selection code start 
    public potentialSelection: number[] = [];
    public potentialSelectAllState: SelectAllCheckboxState = 'unchecked';

    public onSelectedKeysChangePotential(e) {
        const len = this.potentialSelection.length;

        if (len === 0) {
            this.potentialSelectAllState = 'unchecked';
        } else if (len > 0 && len < this.potentialRefundsData.length) {
            this.potentialSelectAllState = 'indeterminate';
        } else {
            this.potentialSelectAllState = 'checked';
        }
        //e.currentTarget.checked ? this.generateRefundCount++ : this.generateRefundCount--;
    }

    public onSelectAllChangePotential(checkedState: SelectAllCheckboxState) {
        if (checkedState === 'checked') {
            this.potentialSelection = this.potentialRefundsData.map((item) => item.accountNumber);
            this.potentialSelectAllState = 'checked';
        } else {
            this.potentialSelection = [];
            this.potentialSelectAllState = 'unchecked';
        }
    }
    //selection code end

    ngOnInit() {
        this.refundsManagement = this.siteService.getSiteJson().constants.i18n.refundsmanagement;
        this.subscription = this.refundsService.getpotentialrefundstransfer()
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.isOverlayError = false;
                this.potentialRefundsData = resp;
               
                this.pageSizes = [
                    { text: 'All', value: this.potentialRefundsData.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];
            }, error => {
               
                this.isOverlayBusy = false;
                this.isOverlayError = true;

            })
        this.node = this.siteService;
        this.node = this.node.site.constants.enums.refundsmanagement.NodeEnum.PotentialMemberRefundsTransfers;
        this.atsI18nService.initI18nJson(this.refundsManagement);
    }

    selectAllPotentialRefund(event, data) {
        if (event == 'checked') {
            this.potentialRefundCount = data.length;
            this.checkAllPotentialRefund = true;
            data.map(function (item) {
                item.Discontinued = true;
            })

        } else {
            this.potentialRefundCount = 0;
            this.checkAllPotentialRefund = false;
            data.map(function (item) {
                item.Discontinued = false;
            })
        }
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
        if (this.id) {
            clearInterval(this.id);
        }
    }

}
