import { Component, OnInit, ViewChild, ElementRef, HostListener, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SiteService, AtsI18nService } from 'core-foundation';
import { Subscription } from 'rxjs';
import { PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { RefundsService } from '../refunds.service';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';

@Component({
    selector: 'app-refundchecksreport',
    templateUrl: './refundchecksreport.component.html',
    styleUrls: ['./refundchecksreport.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RefundchecksreportComponent implements OnInit {

    reportRefundsData: any[];
    displayingRefundData: number = 0;
    fromDateSelectedValue: Date = new Date();
    toDateSelectedValue: Date = new Date();
    showReportPDF: boolean = false;
    subscription: Subscription;
    fromDate: any;
    toDate: any;
    sourceFilter: any;
    sourceFilterValue: any;
    sourceFilterText: any;
    isOverlayBusy: boolean = true;
    isOverlayError: boolean;
    sourceFilterCheck: any;
    displayingData: number = 0;
    daysFilterValue: any;
    daysFilterText: any;
    daysFilter: any;
    daysFilterCheck: any;
    preferences: any;
    siteData: any;
    companyName: any;
    i18n: any;
    actionName: string;
    site: any;
    journalData: any;
    popupRef: PopupRef;
    journalPopup: boolean;
    node: any;
    refundsManagement: any;
    pageSize = 10;
    pageSizes: any;
    sourceText: string = '';
    daysText: string = '';
    refundCheckCount: number = 0;
    modalOpened = false;
    showSourceFilter = false;
    refundChecksSelection: number[] = [];
    refundChecksSelectAllState: SelectAllCheckboxState = 'unchecked';

    constructor(
        private siteService: SiteService,
        private refundsService: RefundsService,
        private popupService: PopupService,
        private atsI18nService: AtsI18nService
    ) { }

    @ViewChild('popupSourceFilter', { read: ElementRef }) popupSourceFilter: ElementRef;
    
    @ViewChild('anchorSourceFilter') anchorSourceFilter: ElementRef;

    @ViewChild('popupDaysFilter', { read: ElementRef }) popupDaysFilter: ElementRef;
    showDaysFilter = false;
    @ViewChild('anchorDaysFilter') anchorDaysFilter: ElementRef;

    @ViewChild('reportPDFpopup', { read: ElementRef }) reportPDFpopup: ElementRef;
    @ViewChild('anchorReportPDF') anchorReportPDF: ElementRef;

    @HostListener('keydown', ['$event'])
    keydown(event: any): void {
        if (event.keyCode === 27) {
            this.toggleSourceFilter('sourceFilter', false);
            this.toggleDaysFilter('daysFilter', false);
        }
    };

    @HostListener('document:click', ['$event'])
    documentClick(event: any): void {
        if (!this.containsSourceFilter(event.target))
            this.toggleSourceFilter('sourceFilter', false);
        if (!this.containsDaysFilter(event.target))
            this.toggleDaysFilter('daysFilter', false);
    };

    ngOnInit() {
        this.fromDateSelectedValue = new Date(2014, 1, 17);
        this.fromDate = this.fromDateSelectedValue.toISOString().split('T')[0];
        this.toDateSelectedValue = new Date();
        this.toDate = this.toDateSelectedValue.toISOString().split('T')[0];
        this.reportRefundGridData(this.fromDate, this.toDate);
        this.fillDropdowns();
    }

    //selection code start 
    onSelectedKeysChange(e) {
        const len = this.refundChecksSelection.length;
        if (len === 0) {
            this.refundChecksSelectAllState = 'unchecked';
            this.refundCheckCount = 0;
        } else if (len > 0 && len < this.reportRefundsData.length) {
            this.refundChecksSelectAllState = 'indeterminate';
        } else {
            this.refundChecksSelectAllState = 'checked';
        }
        len > 0 ? this.refundCheckCount++ : this.refundCheckCount = 0;
    }

    onSelectAllChangeRefundChecks(checkedState: SelectAllCheckboxState) {
        if (checkedState === 'checked') {
            this.refundChecksSelection = this.reportRefundsData.map((item) => item.account);
            this.refundChecksSelectAllState = 'checked';
            this.refundCheckCount = this.reportRefundsData.length;
        } else {
            this.refundChecksSelection = [];
            this.refundChecksSelectAllState = 'unchecked';
            this.refundCheckCount = 0;
        }
    }

    //selection code end

    togglePopup(template: TemplateRef<any>) {
        if (this.popupRef) {
            this.popupRef.close();
            this.popupRef = null;
        } else {
            this.popupRef = this.popupService.open({
                content: template,
                offset: { top: 539, left: 649 }
            });
        }
    }

    viewAllJournal() {
        this.journalData = "";
        this.modalOpened = true;
    }

    viewJournal(dataItem) {
        this.journalPopup = true;
        this.journalData = dataItem;
        this.modalOpened = true;
        this.actionName = dataItem.customerName;
        this.journalPopup = true;
    };

    reportRefundGridData(fromDate, toDate) {
        this.subscription = this.refundsService.getreportrefundsdata(this.displayingData, fromDate, toDate)
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.reportRefundsData = resp.reportRefundsItems;
                this.pageSizes = [
                    { text: 'All', value: this.reportRefundsData.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];
            }, error => {
                this.isOverlayError = true;
                this.fillDropdowns();
            });
    }

    fillDropdowns() {
        this.siteData = this.siteService.getSiteJson().constants;
        this.refundsManagement = this.siteData.i18n.refundsmanagement;
        this.sourceFilterText = this.refundsManagement.SourceFilterEnum;
        this.sourceFilterValue = this.siteData.enums.refundsmanagement.SourceFilterEnum;
        this.sourceFilterValue = Object.keys(this.sourceFilterValue).map(key => ({ text: key, value: this.sourceFilterValue[key] }));
        this.sourceFilter = this.sourceFilterText[0];
        this.sourceFilterCheck = 0;
        this.daysFilterText = this.siteData.i18n.refundsmanagement.SharedDaysFilterEnum;
        this.daysFilterValue = this.siteData.enums.refundsmanagement.SharedDaysFilterEnum;
        this.daysFilterValue = Object.keys(this.daysFilterValue).map(key => ({ text: key, value: this.daysFilterValue[key] }));
        this.daysFilter = this.daysFilterText[3];
        this.daysFilterCheck = 3;
        this.site = this.siteData.i18n.site;
        this.i18n = this.siteService;
        this.i18n = this.i18n.site.constants.i18n.refundsmanagement;
        this.subscription = this.refundsService.getcompany().subscribe((data: any) => {
            this.companyName = data.text;
        });
        this.node = this.siteService;
        this.node = this.node.site.constants.enums.refundsmanagement.NodeEnum.RefundChecksReport;
        let I18nJson: any = {
            "site": this.site,
            "sourceFilter": this.sourceFilter,
            "daysFilter": this.daysFilter
        }
        this.atsI18nService.initI18nJson(I18nJson);
    }

    sourceFilterConsumer(text, value) {
        this.sourceFilter = text;
        this.sourceFilterCheck = value;
        this.displayingRefundData = value;
        this.isOverlayBusy = true;
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.preferences = this.getLocalPreference('refundsmanagement', 'reportsRefundSourceFilter')
        let params = {
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": value
        }
        this.displayingData = value;
        this.subscription = this.refundsService.savepreference(params)
            .subscribe((resp: any) => {
            })
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.preferences = this.getLocalPreference('refundsmanagement', 'reportsRefundFromDateFilter')
        let fromDateParams = {
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": this.fromDateSelectedValue
        }
        this.subscription = this.refundsService.savepreference(fromDateParams)
            .subscribe((resp: any) => {
            })
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.preferences = this.getLocalPreference('refundsmanagement', 'reportsRefundToDateFilter')
        let toDateParams = {
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": this.fromDateSelectedValue
        }

        this.subscription = this.refundsService.savepreference(toDateParams)
            .subscribe((resp: any) => {
            })
        if (text == 'Date Range') {
            this.fromDateSelectedValue = new Date(this.fromDateSelectedValue.getFullYear(), this.fromDateSelectedValue.getMonth(), this.fromDateSelectedValue.getDate());
            this.fromDate = this.fromDateSelectedValue.toISOString().split('T')[0];
            this.toDateSelectedValue = new Date(this.toDateSelectedValue.getFullYear(), this.toDateSelectedValue.getMonth(), this.toDateSelectedValue.getDate());
            this.toDate = this.toDateSelectedValue.toISOString().split('T')[0];
        } else if (text == 'Last 30 Days') {
            this.getSelectedRangeDates(30);
        } else if (text == 'Last 60 Days') {
            this.getSelectedRangeDates(60);
        } else if (text == 'Last 90 Days') {
            this.getSelectedRangeDates(90);
        }
        this.reportRefundGridData(this.fromDate, this.toDate);
        this.showSourceFilter = false;
    };

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

    filterReportRefunds() {
        this.fromDate = this.fromDateSelectedValue.toISOString().split('T')[0];
        this.toDate = this.toDateSelectedValue.toISOString().split('T')[0];
        this.isOverlayBusy = true;
        this.subscription = this.refundsService.getreportrefundsdata(this.displayingData, this.fromDate, this.toDate)
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.reportRefundsData = resp.reportRefundsItems;
            }, error => {
                this.isOverlayError = true;
            });
    }

    selectedReportRefundsDateRange(text, value) {
        this.daysFilter = text;
        this.daysFilterCheck = value;
        if (text == 'Date Range') {
            this.fromDateSelectedValue = new Date(2009, 12, 24);
            this.fromDate = this.fromDateSelectedValue.toISOString().split('T')[0];
            this.toDateSelectedValue = new Date(new Date().getFullYear(), this.toDateSelectedValue.getMonth(), this.toDateSelectedValue.getDate());
            this.toDate = this.toDateSelectedValue.toISOString().split('T')[0];
        } else if (text == 'Last 30 Days') {
            this.isOverlayBusy = true;
            this.getSelectedRangeDates(30);
        }
        else if (text == 'Last 60 Days') {
            this.isOverlayBusy = true;
            this.getSelectedRangeDates(60);
        } else if (text == 'Last 90 Days') {    
            this.isOverlayBusy = true;
            this.getSelectedRangeDates(90);
        }
        if (text != 'Date Range') {
            this.reportRefundGridData(this.fromDate, this.toDate);
        }
        this.showSourceFilter = false;
        this.showDaysFilter = false;
    }

    getSelectedRangeDates(value:number) {
        this.fromDateSelectedValue = new Date();
        this.fromDate = (new Date(new Date().setDate(this.fromDateSelectedValue.getDate() - value))).toISOString().split('T')[0];
        this.toDateSelectedValue = new Date(this.toDateSelectedValue.getFullYear(), this.toDateSelectedValue.getMonth(), this.toDateSelectedValue.getDate());
        this.toDate = this.toDateSelectedValue.toISOString().split('T')[0];
    }

    toggleSourceFilter(text, showSourceFilter?: boolean): void {
        this.showSourceFilter = showSourceFilter !== undefined ? showSourceFilter : !this.showSourceFilter;
        this.sourceText = this.showSourceFilter ? text : '';
    }

    toggleDaysFilter(text, showDaysFilter?: boolean): void {
        this.showDaysFilter = showDaysFilter !== undefined ? showDaysFilter : !this.showDaysFilter;
        this.daysText = this.showDaysFilter ? text : '';
    }

    containsSourceFilter(target: any): boolean {
        return this.anchorSourceFilter.nativeElement.contains(target) ||
            (this.popupSourceFilter ? this.popupSourceFilter.nativeElement.contains(target) : false);
    }

    containsDaysFilter(target: any): boolean {
        return this.anchorDaysFilter.nativeElement.contains(target) ||
            (this.popupDaysFilter ? this.popupDaysFilter.nativeElement.contains(target) : false);
    }

    sourceMouseOver() {
        this.showSourceFilter = this.sourceText == 'sourceFilter' ? true : false;
    }

    daysRangeMouseOver() {
        this.showDaysFilter = this.daysText == 'daysFilter' ? true : false;
    }

    toggleReportPDF(showRefundPDF?: boolean): void {
        this.showReportPDF = showRefundPDF !== undefined ? showRefundPDF : !this.showReportPDF;
    }

    rowCallback(context: RowClassArgs) {
        const isEven = context.index % 2 == 0;
        return {
            even: isEven,
            odd: !isEven
        }
    }

    displayJournalModal(event) {
        this.modalOpened = event;
    }

    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

}
