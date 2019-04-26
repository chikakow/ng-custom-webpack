import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { SiteService,AtsI18nService } from 'core-foundation';
import { RefundsService } from '../refunds.service';
import { Subscription } from 'rxjs';
import { PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-journal',
    templateUrl: './journal.component.html',
    styleUrls: ['./journal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JournalComponent implements OnInit {
    viewJouralData: any;
    isJournalBusy: boolean = false;
    isJournalError: boolean = false;
    refundsManagement: any;
    actionName: string;
    companyName: string;
    site: any;
    siteJson: any;
    @Input() journalData: any;
    @Output() valueChange = new EventEmitter();
    showJournalPDF: boolean = false;
    private subscription: Subscription;
    public pageSize = 10;
    public pageSizes;
    constructor(
                    private siteService: SiteService,
                    private refundsService: RefundsService,
                    private atsI18nService: AtsI18nService
                ) { }


    ngOnInit() {
        this.siteJson = this.siteService.getSiteJson();
        this.site = this.siteJson.constants.i18n.site;
        this.refundsManagement = this.siteJson.constants.i18n.refundsmanagement;
        this.subscription = this.refundsService.getcompany().subscribe((data: any) => {
            this.companyName = data.text;
        });
        if (this.journalData == null || this.journalData == "")
            this.loadviewAllJournal();
        else
            this.loadviewJournal();

        let i18nValues: any = {
            "companyName": this.companyName,
            "refundsManagement": this.refundsManagement,
            "site": this.site,
            "actionName": this.actionName

        }
        this.atsI18nService.initI18nJson(i18nValues);
    }

    loadviewJournal() {
        this.isJournalBusy = true;
        this.actionName = " for " + this.journalData.customerName;
        let params = [this.journalData.account, this.journalData.checkNo];
       
        this.subscription = this.refundsService.getJournalWithParameters(params)
            .subscribe((resp: any) => {
                this.isJournalBusy = false;
                this.isJournalError = false;
                this.viewJouralData = resp;
                this.pageSizes = [
                    { text: 'All', value: this.viewJouralData.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];

            }, error => {
                this.isJournalBusy = false;
                this.isJournalError = true;
            });
    }

    loadviewAllJournal() {
        this.isJournalBusy = true;
        this.actionName = "";
        this.subscription = this.refundsService.getJournal()
            .subscribe((resp: any) => {
                this.isJournalBusy = false;
                this.viewJouralData = resp;
                this.pageSizes = [
                    { text: 'All', value: this.viewJouralData.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];
            }, error => {
                this.isJournalBusy = true;
                this.isJournalError = false;
            });
    }


    public toggleJournalPDF(showJournalPDF?: boolean): void {
        this.showJournalPDF = showJournalPDF !== undefined ? showJournalPDF : !this.showJournalPDF;
    }

    public rowCallback(context: RowClassArgs) {
        const isEven = context.index % 2 == 0;
        return {
            even: isEven,
            odd: !isEven
        }
    }

    close() {
        this.valueChange.emit(false);
    }


    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }
    

}
