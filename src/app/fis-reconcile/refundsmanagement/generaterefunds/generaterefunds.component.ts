import { Component, OnInit, ViewChild, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { RefundsService } from '../refunds.service';
import { SiteService, AtsI18nService } from 'core-foundation';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';
@Component({
    selector: 'app-generaterefunds',
    templateUrl: './generaterefunds.component.html',
    styleUrls: ['./generaterefunds.component.scss'],
    encapsulation: ViewEncapsulation.None     // required for showing alternate row background colors transparent
})

export class GeneraterefundsComponent implements OnInit {

    private subscription: Subscription;
    generateRefundGridView: any[];
    isOverlayBusy: boolean = true;
    isOverlayError: boolean;
    sourceFilterValue: any;
    sourceFilterText: string;
    sourceFilter: string;
    sourceFilterCheck: number;
    generateRefundCount: number = 0;
    checkAllgenerateRefund: boolean = false;
    generateRefundsData: any;
    refershIntervalValue: any;
    refershIntervalText: string;
    refershInterval: string; 
    refershIntervalCheck: number;
    displayingData: number = 0;
    setIntervalValue: number = 0;
    showPDF: boolean = false;
    activeData = [];
    preferences: any;
    constants: any;
    refundsManagement: any;
    companyName: string;
    automaticRefreshIntervalSubscription: Subscription;
    site: any;
    pageSize: number = 10;
    pageSizes;
    sourceText: string = '';
    refreshText: string = '';
    refundSelection: number[] = [];
    refundSelectAllState: SelectAllCheckboxState = 'unchecked';

    constructor(
        private siteService: SiteService,
        private refundsService: RefundsService,
        private atsI18nService: AtsI18nService
    ) { }

    //selection code start 
    

    @ViewChild('popupRefresh', { read: ElementRef }) public popupRefresh: ElementRef;
    showRefresh = false;
    @ViewChild('anchorRefresh') public anchorRefresh: ElementRef;

    @ViewChild('popupsourceFilter', { read: ElementRef }) public popupsourceFilter: ElementRef;
    showsourceFilter = false;
    @ViewChild('anchorsourceFilter') public anchorsourceFilter: ElementRef;
    @HostListener('keydown', ['$event'])

    public keydown(event: any): void {
        if (event.keyCode === 27) {
            this.togglesourceFilter('source', false);
            this.toggleRefresh('refresh', false);
        }
    }

    @HostListener('document:click', ['$event'])
    public documentClick(event: any): void {
        if (!this.containssourceFilter(event.target))
            this.togglesourceFilter('source', false);
        if (!this.containsRefresh(event.target))
            this.toggleRefresh('refresh', false);
    }

    public onSelectedKeysChange(e) {
        const len = this.refundSelection.length;
        if (len === 0) {
            this.refundSelectAllState = 'unchecked';
            this.generateRefundCount = 0;
        } else if (len > 0 && len < this.generateRefundGridView.length) {
            this.refundSelectAllState = 'indeterminate';
        } else {
            this.refundSelectAllState = 'checked';
        }       
        len > 0 ? this.generateRefundCount++ : this.generateRefundCount = 0;
    }

    onSelectAllChange(checkedState: SelectAllCheckboxState) {
        if (checkedState === 'checked') {
            this.refundSelection = this.generateRefundGridView.map((item) => item.customerName);
            this.refundSelectAllState = 'checked';
            this.generateRefundCount = this.generateRefundGridView.length;
        } else {
            this.refundSelection = [];
            this.refundSelectAllState = 'unchecked';
            this.generateRefundCount = 0;
        }
    }
    //selection code end

    rowCallback(context: RowClassArgs) {
        const isEven = context.index % 2 == 0;
        return {
            even: isEven,
            odd: !isEven
        }
    }

    issueRefund() {
        alert('This feature is not implemented yet.');
    }

    ngOnInit() {
        this.generateRefundGridData();
        this.filldropdowns();
        if (this.refershIntervalCheck !== 0) {
            this.isOverlayBusy = true;
            this.automaticRefreshIntervalSubscription = interval(this.refershIntervalCheck * 60000)
                .subscribe(x => {
                    this.generateRefundGridData();
                });
        }
    }

    generateRefundGridData() {
        this.isOverlayBusy = true;
        this.subscription = this.refundsService.getgeneraterefundsdata(this.displayingData)
            .subscribe((resp: any) => {
                this.generateRefundGridView = resp.generateRefundsItems;
                this.activeData = resp.generateRefundsItems;
                this.isOverlayBusy = false;
                this.isOverlayError = false;
                this.pageSizes = [
                    { text: 'All', value: this.generateRefundGridView.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];

            }, error => {
                this.isOverlayError = true;
                this.isOverlayBusy = false;
                this.filldropdowns();
            })

        this.subscription = this.refundsService.getcompany().subscribe((data: any) => {
            this.companyName = data.text;
        });
        let i18nvalues: any = {
            "companyName": this.companyName,
            "refundsManagement": this.refundsManagement,
            "site": this.site
        }
        this.atsI18nService.initI18nJson(i18nvalues);
    }

    filldropdowns() {
        this.constants = this.siteService.getSiteJson().constants;
        this.refundsManagement = this.constants.i18n.refundsmanagement;
        this.sourceFilterText = this.refundsManagement.SourceFilterEnum;
        this.sourceFilterValue = this.constants.enums.refundsmanagement.SourceFilterEnum;
        this.sourceFilterValue = Object.keys(this.sourceFilterValue).map(key => ({ text: key, value: this.sourceFilterValue[key] }));
        this.sourceFilter = this.sourceFilterText[0];
        this.sourceFilterCheck = 0;
        this.refershIntervalText = this.refundsManagement.RefreshIntervalsEnum;
        this.refershIntervalValue = this.constants.enums.refundsmanagement.RefreshIntervalsEnum;
        this.refershIntervalValue = Object.keys(this.refershIntervalValue).map(key => ({ text: key, value: this.refershIntervalValue[key] }));
        this.refershInterval = this.refershIntervalText[0];
        this.refershIntervalCheck = 0;
        this.refershIntervalValue.sort((a: any, b: any) => {
            let x = a.value;
            let y = b.value;
            return x < y ? -1 : x > y ? 1 : 0;
        });
        this.site = this.constants.i18n.site;
    }

    sourceFilterData(text, value) {
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.sourceFilter = text;
        this.sourceFilterCheck = value;
        this.preferences = this.getLocalPreference('refundsmanagement', 'generateRefundSourceFilter');
        let params = {
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": value

        }
        this.displayingData = value;
        this.isOverlayError = true;
        this.subscription = this.refundsService.savepreference(params)
            .subscribe((resp: any) => {
            })
        this.generateRefundGridData();
        this.showsourceFilter = false;
    }

    togglePDF(): void {
        this.showPDF = !this.showPDF;
    }

    selectAll(event) {
        if (event == 'checked') {
            this.generateRefundCount = this.activeData.length;
            this.checkAllgenerateRefund = true;
            this.activeData.map(function (item) {
                item.Discontinued = true;
            })
        } else {
            this.generateRefundCount = 0;
            this.checkAllgenerateRefund = false;
            this.activeData.map(function (item) {
                item.Discontinued = false;
            })
        }
    }

    refershIntervalData(text, value) {
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.showRefresh = false;
        this.refershInterval = text;
        this.refershIntervalCheck = value;
        this.preferences = this.getLocalPreference('refundsmanagement', 'generateRefundsNodeRefreshChoices')
        let params = {
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": value
        }
        this.subscription = this.refundsService.savepreference(params)
            .subscribe((resp: any) => {
            })
        this.automaticRefreshIntervalSubscription.unsubscribe();
        if (this.refershIntervalCheck !== 0) {
            interval(this.refershIntervalCheck * 60000).subscribe(x => {
                this.generateRefundGridData();
            });
        }
    }

    getLocalPreference(moduleName, prefName) {
        let group = this.preferences;
        if (!group) {
            throw new Error('Preference group (module) name not found: ' + moduleName);
        }
        if (prefName) {
            let pref = group.atsSingleOrDefault(x => x.preferenceName === prefName)
            if (!pref) {
                throw new Error('Preference name not found: ' + prefName);
            }
            //if the preference value is the string "true" or "false"
            //assume it wants to be converted to a bolean
            if (pref.preferenceValue == 'true') {
                pref.preferenceValue = true;
            }
            else if (pref.preferenceValue == 'false') {
                pref.preferenceValue = false;
            }
            return pref;
        }
        return group;
    }

    toggleRefresh(text, showRefresh?: boolean): void {
        this.showRefresh = showRefresh !== undefined ? showRefresh : !this.showRefresh;
        if (this.showRefresh) {
            this.refreshText = text;
        } else {
            this.refreshText = '';
        }
    }

    togglesourceFilter(text, showsourceFilter?: boolean): void {
        this.showsourceFilter = showsourceFilter !== undefined ? showsourceFilter : !this.showsourceFilter;
        if (this.showsourceFilter) {
            this.sourceText = text;
        } else {
            this.sourceText = '';
        }
    }

    private containssourceFilter(target: any): boolean {
        return this.anchorsourceFilter.nativeElement.contains(target) ||
            (this.popupsourceFilter ? this.popupsourceFilter.nativeElement.contains(target) : false);
    }

    private containsRefresh(target: any): boolean {
        return this.anchorRefresh.nativeElement.contains(target) ||
            (this.popupRefresh ? this.popupRefresh.nativeElement.contains(target) : false);
    }

    sourceMouseOut(event: any) {        
        if (!this.containssourceFilter(event.target)) {
            this.showsourceFilter = false;
        }
    }

    sourceMouseOver() {
        this.showsourceFilter = this.sourceText == 'source' ? true : false;
    }

    refreshMouseOver() {
        this.showRefresh = this.refreshText == 'refresh' ? true : false;
    }

    refreshMouseOut() {
        this.showRefresh = false;
    }

    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

}
