import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChromeService } from '../chrome.service';
import { SiteService, DatetimeService,AtsI18nService } from 'core-foundation';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    groupDate: any;
    chrome: any;
    appListEnum: any = {};
    responseData: any;
    isOverlayBusy: boolean;
    currentDate: any;
    isOverlayError: boolean;
    history: any;
    dates: any;
    siteJson: any;
    private subscription: Subscription;

    constructor(

        private chromeService: ChromeService,
        private siteService: SiteService,
        private atsI18nService: AtsI18nService
    ) { }

    ngOnInit() {
        this.getChromeI18nData();
        let i18nValues: any = {
            "chorme": this.chrome,
            "appListEnum": this.appListEnum
        }
        this.atsI18nService.initI18nJson(i18nValues);
    
    }

    getChromeI18nData() {
        this.siteJson = this.siteService.getSiteJson().constants;
        this.chrome = this.siteJson.i18n.chrome;     
        this.appListEnum = this.siteJson.i18n.site.AppListEnum;

    }

    loadHistory() { 
        this.responseData = null;
        this.isOverlayBusy = true;
        this.subscription = this.chromeService.gethistory()
            .subscribe((data: any) => {            
                this.responseData = data;
                this.history = data.atsPipe((h) => {
                    h.dateOnly = DatetimeService.getDateOnly(h.dts).toString(); //Serializing for easier comparisons
                });
                this.dates = this.history.atsDistinct(x => x.dateOnly);
                this.isOverlayBusy = false;
            },
                error => {
                    this.isOverlayError = true;
                    console.log(error);
                });
    }

    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
    }

    @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
    public show = false;
    @ViewChild('anchorhistory') public anchor: ElementRef;
    @HostListener('keydown', ['$event'])
    public keydown(event: any): void {
        if (event.keyCode === 27) {
            this.toggle(false);
        }
    }
    @HostListener('document:click', ['$event'])
    public documentClick(event: any): void {
        if (!this.contains(event.target)) {
            this.toggle(false);
        }
        if (this.show) {
            this.loadHistory();
        }
    }
    public toggle(show?: boolean): void {
        this.show = show !== undefined ? show : !this.show;
    }
    private contains(target: any): boolean {
        return this.anchor.nativeElement.contains(target) ||
            (this.popup ? this.popup.nativeElement.contains(target) : false);
    } 
}
