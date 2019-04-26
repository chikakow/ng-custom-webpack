import { Component, OnInit, ViewChild, ElementRef, HostListener, TemplateRef, ViewEncapsulation } from '@angular/core';
import { SiteService,AtsI18nService } from 'core-foundation';
import { Subscription } from 'rxjs';
import { PageChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { RefundsService } from '../refunds.service';

import {
    PopupService,
    PopupRef
} from '@progress/kendo-angular-popup';

@Component({
  selector: 'app-reportrefunds',
  templateUrl: './reportrefunds.component.html',
    styleUrls: ['./reportrefunds.component.scss'],
    encapsulation: ViewEncapsulation.None 
})
export class ReportrefundsComponent implements OnInit {
    popupAlign: any = { horizontal: "right", vertical: "top" };
    reportRefundView: any[];
    public reportRefundsData: any[];
    reportRefundCount: number = 0;
    displayingRefundData: number = 0;
    checkAllReportRefund: boolean = false;
    public value: Date = new Date();
    public value1: Date = new Date();
    showReportPDF: boolean = false;
    private Subscription: Subscription;
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
    private popupRef: PopupRef;
    journalPopup: boolean;
    node: any;
    refundsManagement: any;

    public pageSize = 10;
    public pageSizes;
    constructor(
        private siteService: SiteService,   
        private refundsService: RefundsService,
        private popupService: PopupService,
        private atsI18nService: AtsI18nService
    ) {        

    }

    public rowCallback(context: RowClassArgs) {
        const isEven = context.index % 2 == 0;
        return {
            even: isEven,
            odd: !isEven
        };
    }
    public togglePopup(template: TemplateRef<any>) {
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
   
 
    ngOnInit() {

        this.value = new Date(2009, 12, 24);
        this.fromDate = this.value.toISOString().split('T')[0];
        console.log(new Date());
        this.value1 = new Date();
        this.toDate = this.value1.toISOString().split('T')[0];
        this.reportRefundGridData(this.fromDate, this.toDate);
    
    }

   
    public modalOpened = false;
    viewAllJournal(component) {           
        this.journalData = "";
        this.modalOpened = true;
      //  this[component + 'Opened'] = true;
    }

    viewJournal(component, dataItem) {  
        // this.modalOpened = false;
        this.journalPopup = true;
        this.journalData = dataItem;
        this.modalOpened = true;
        //this[component + 'Opened'] = true;
        this.actionName = dataItem.customerName;
        this.journalPopup = true;
    }

    reportRefundGridData(fromDate, toDate) {
        this.Subscription = this.refundsService.getreportrefundsdata(this.displayingData, fromDate, toDate)
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.reportRefundsData = resp.reportRefundsItems;
                this.loadReportRefundItems();
                this.fillDropdowns();  

                this.pageSizes = [
                    { text: 'All', value: this.reportRefundsData.length },
                    { text: '5', value: 5 },
                    { text: '10', value: 10 },
                    { text: '20', value: 20 },

                ];
            }, error => {
                this.isOverlayError = true;
            });     
    }

    fillDropdowns() {
        this.siteData = this.siteService.getSiteJson().constants;
        this.sourceFilterText = this.siteData.i18n.refundsmanagement.SourceFilterEnum;
        this.refundsManagement = this.siteData.i18n.refundsmanagement;
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
        this.Subscription = this.refundsService.getcompany().subscribe((data: any) => {
            this.companyName = data.text;
        });
        this.node = this.siteService;
        this.node = this.node.site.constants.enums.refundsmanagement.NodeEnum.ReportRefunds;
        this.atsI18nService.initI18nJson(this.refundsManagement);

    }
    checkBoxReportRefundChanged(event, dataItem) {
        event.target.checked ? this.reportRefundCount++ : this.reportRefundCount--;
    }

    private loadReportRefundItems(): void {
        this.reportRefundView = this.reportRefundsData;
    }
    public pageChangeReportRefund(event: PageChangeEvent): void {
        this.loadReportRefundItems();
    }

    selectAllReportRefund(event, data) {
        if (event == 'checked') {
            this.reportRefundCount = data.length;
            this.checkAllReportRefund = true;
            data.map(function (item) {
                item.Discontinued = true;
            })
        } else {
            this.reportRefundCount = 0;
            this.checkAllReportRefund = false;
            data.map(function (item) {
                item.Discontinued = false;
            })
        }
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
        this.Subscription = this.refundsService.savepreference(params)
            .subscribe((resp: any) => {
            })
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.preferences = this.getLocalPreference('refundsmanagement', 'reportsRefundFromDateFilter')
        let fromDateParams = {      
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": this.value
        }  
        this.Subscription = this.refundsService.savepreference(fromDateParams)
            .subscribe((resp: any) => {
            })
        this.preferences = this.siteService;
        this.preferences = this.preferences.angular.atsServerValues.userPreferences.refundsmanagement;
        this.preferences = this.getLocalPreference('refundsmanagement', 'reportsRefundToDateFilter')
        let toDateParams = {            
            "preferenceName": this.preferences.preferenceName,
            "preferenceTypeId": this.preferences.preferenceTypeId,
            "preferenceValue": this.value
        }     

        this.Subscription = this.refundsService.savepreference(toDateParams)
            .subscribe((resp: any) => {
            })
        if (text == 'Date Range') {
            this.value = new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
            this.fromDate = this.value.toISOString().split('T')[0];
            this.value1 = new Date(this.value1.getFullYear(), this.value1.getMonth(), this.value1.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        } else if (text == 'Last 30 Days') {
            this.value = new Date();
            this.fromDate = this.value.setDate(value.setDate(value.getDate() - 30));
            this.value1 = new Date(this.value1.getFullYear(), this.value1.getMonth(), this.value1.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        }
        else if (text == 'Last 60 Days') {
            this.value = new Date();
            this.fromDate = this.value.setDate(value.setDate(value.getDate() - 60));
            this.value1 = new Date(this.value1.getFullYear(), this.value1.getMonth(), this.value1.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        }
        this.reportRefundGridData(this.fromDate, this.toDate);
        this.showSourceFilter = false;
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

    filterReportRefunds() {
        this.fromDate = this.value.toISOString().split('T')[0];
        this.toDate = this.value1.toISOString().split('T')[0];
        this.isOverlayBusy = true;     
        this.Subscription = this.refundsService.getreportrefundsdata(this.displayingData, this.fromDate, this.toDate)
            .subscribe((resp: any) => {
                this.isOverlayBusy = false;
                this.reportRefundsData = resp.reportRefundsItems;
                this.loadReportRefundItems();
            }, error => {
                this.isOverlayError = true;
            });

    }

    selectedReportRefundsDateRange(text, value) {
        this.daysFilter = text;
        this.daysFilterCheck = value;
        if (text == 'Date Range') {
            this.value = new Date(2009, 12, 24);
            this.fromDate = this.value.toISOString().split('T')[0];
            this.value1 = new Date(new Date().getFullYear(), this.value1.getMonth(), this.value1.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        } else if (text == 'Last 30 Days') {
            this.isOverlayBusy = true;
            this.value = new Date();
            this.fromDate = (new Date(new Date().setDate(this.value.getDate() - 30))).toISOString().split('T')[0];
            this.value1 = new Date(this.value1.getFullYear(), this.value1.getMonth(), this.value1.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        }
        else if (text == 'Last 60 Days') {
            this.isOverlayBusy = true;
            this.value = new Date();
            this.fromDate = (new Date(new Date().setDate(this.value.getDate() - 60))).toISOString().split('T')[0];
            this.value1 = new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        } else if (text == 'Last 90 Days') {
            this.isOverlayBusy = true;
            this.value = new Date();
            this.fromDate = (new Date(new Date().setDate(this.value.getDate() - 90))).toISOString().split('T')[0];
            this.value1 = new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
            this.toDate = this.value1.toISOString().split('T')[0];
        }
        if (text != 'Date Range') {
            this.reportRefundGridData(this.fromDate, this.toDate);
        }
        this.showSourceFilter = false;
        this.showDaysFilter = false;
    }

    public toggleSourceFilter(showSourceFilter?: boolean): void {
        this.showSourceFilter = showSourceFilter !== undefined ? showSourceFilter : !this.showSourceFilter;
    }

    public toggleDaysFilter(showDaysFilter?: boolean): void {
        this.showDaysFilter = showDaysFilter !== undefined ? showDaysFilter : !this.showDaysFilter;
    }

    @ViewChild('popupSourceFilter', { read: ElementRef }) public popupSourceFilter: ElementRef;
    public showSourceFilter = false;
    @ViewChild('anchorSourceFilter') public anchorSourceFilter: ElementRef;


    @ViewChild('popupDaysFilter', { read: ElementRef }) public popupDaysFilter: ElementRef;
    public showDaysFilter = false;
    @ViewChild('anchorDaysFilter') public anchorDaysFilter: ElementRef;

    @ViewChild('reportPDFpopup', { read: ElementRef }) public reportPDFpopup: ElementRef;
    @ViewChild('anchorReportPDF') public anchorReportPDF: ElementRef;


    @HostListener('keydown', ['$event'])
    public keydown(event: any): void {
        if (event.keyCode === 27) {
            this.toggleSourceFilter(false);
            this.toggleDaysFilter(false);
            this.toggleReportPDF(false);
           // this.toggleViewAllJournal(false);
        }
    }

    @HostListener('document:click', ['$event'])
    public documentClick(event: any): void {
        if (!this.containsSourceFilter(event.target))
            this.toggleSourceFilter(false);
        if (!this.containsDaysFilter(event.target))
            this.toggleDaysFilter(false);
        if (!this.containsReportPDF(event.target))
            this.toggleReportPDF(false);
    }

    
    public containsSourceFilter(target: any): boolean {
        return this.anchorSourceFilter.nativeElement.contains(target) ||
            (this.popupSourceFilter ? this.popupSourceFilter.nativeElement.contains(target) : false);
    }
    public containsDaysFilter(target: any): boolean {
        return this.anchorDaysFilter.nativeElement.contains(target) ||
            (this.popupDaysFilter ? this.popupDaysFilter.nativeElement.contains(target) : false);
    }

    public toggleReportPDF(showRefundPDF?: boolean): void {
        this.showReportPDF = showRefundPDF !== undefined ? showRefundPDF : !this.showReportPDF;
    }

    public containsReportPDF(target: any): boolean {
        return this.anchorReportPDF.nativeElement.contains(target) ||
            (this.reportPDFpopup ? this.reportPDFpopup.nativeElement.contains(target) : false);
    }

    displayModal(isModalOpen) {
        this.modalOpened = isModalOpen;
    }

    ngOnDestroy() {
        if (this.Subscription != null)
            this.Subscription.unsubscribe();
    }
   
}
