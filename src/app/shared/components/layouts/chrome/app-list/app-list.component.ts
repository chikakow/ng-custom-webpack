import { Component, OnInit, ViewChild, HostListener, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChromeService } from '../chrome.service';
import { Router } from '@angular/router';
import { AtsI18nService, PagerService, SiteService } from 'core-foundation';




@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit, OnDestroy {
 
    private Subscription: Subscription;
    appI18n: any;
    queryString: string;
    isOverlayBusy: boolean;
    isOverlayError: boolean;
    public show = false;
    // pager object
    public pager: any = {};
    // paged items
    public pagedItems: any[];
    data: any;
    appListEnum: any;
    appChoices: any;
    constants: any;
    chrome: any;
    constructor(
        private pagerService: PagerService,
        private chromeService: ChromeService,
        private siteService: SiteService,
        private atsI18nService: AtsI18nService
    ) { }

    ngOnInit() {
        this.constants = this.siteService.getSiteJson().constants;
        this.appListEnum = this.constants.i18n.site.AppListEnum;
        this.chrome = this.siteService;
        this.chrome = this.chrome.site.constants.i18n.chrome;  
        this.appChoices = this.atsI18nService.convertEnumToChoices(this.constants, 'site.AppListEnum');
        this.getAppI18nJson();
    }

    navigationRoute(url: string, moduleName: string): void {

        if (url.indexOf('refunds') > -1) {
            // this.router.navigate(['company/1/refunds/management']);
            // we need this otherwise it never hits RefundManagement/Index.cshtml
            // hense never loads js scripts for plugins note and journals
            // don't worry after that angular lazy load routes still happens that loads refund management ng7 module.
            window.location.href = '/company/1/refunds/management';
        }
        else if (url.indexOf('reprint') > -1) {
            window.location.href = '/company/1/reprintcheck/management';
        }
        else {
            window.open(this.getLiveUrl(url, moduleName), "_blank");
        }

        this.toggle(false);
    }

    getLiveUrl(url: string, moduleName: string): string {
        let companyId: string = this.constants.site.companyId.toString();
        url = url.replace("{co_id}", companyId);        

        let rootUrl: string = "http://meridian-devel-app";
        let arr: string[] = url.split("/");

        let liveUrl: string = "";
        liveUrl = rootUrl + "/" + moduleName;
        for (let i: number = 0; i < arr.length; ++i) {
            if (i > 2) {
                liveUrl += "/" + arr[i]
            }
        }
        return(liveUrl);
    }

    getAppI18nJson() {
        this.appI18n = this.siteService.getSiteJson().constants.i18n.chrome;
        this.atsI18nService.initI18nJson(this.appI18n);
    }

    loadApps() {
        this.isOverlayBusy = true;
        this.chromeService.getAppsList()

            .subscribe(Response => {
                this.data = Response;
                this.siteService.setAppConfigFromAppList(this.data);

                //TODO: Security setup (DB) must have portal enabled for the user/company by default.
                //      Without it this will fail to find the portal app
                let app;
                let portalApp = this.data.atsSingle(p => p.appId === this.constants.enums.site.AppListEnum.Portal);
                this.data.atsRemove(portalApp);
                for (let i = 0; i < this.data.length; i++) {
                    app = this.data[i]; //pull out data to make it easier to read.

                    let foundApp = this.appChoices.atsSingle(p => p.value === app.appId);

                    if (foundApp) {
                        app.name = foundApp.text;
                    }
                }
                //Sort by Name
                this.data.sort((a: any, b: any) => {
                    let x = a.name;
                    let y = b.name;
                    return x < y ? -1 : x > y ? 1 : 0;
                });

                //the portalApp was removed and when added back in, it didn't have a name. which broke the search.
                portalApp.name = this.appChoices.atsSingle(p => p.value === portalApp.appId).text;
                this.data.unshift(portalApp);

                this.setPage(1);
                this.isOverlayBusy = false;
            },
                error => {
                    this.isOverlayError = true;
                }
        );

    }

    @ViewChild('anchor') public anchor: ElementRef;
    @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;

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

        this.queryString = null;
    }
    public toggle(show?: boolean): void {
        this.show = show !== undefined ? show : !this.show;

        if (this.show) {
            this.loadApps();
        }
        this.queryString = null;
    }
    private contains(target: any): boolean {
        return this.anchor.nativeElement.contains(target) ||
            (this.popup ? this.popup.nativeElement.contains(target) : false);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data.length, page);
        // get current page of items
        this.pagedItems = this.data.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.atsI18nService.initI18nJson(this.pagedItems);
    }

    ngOnDestroy() {
        if (this.Subscription != null)
            this.Subscription.unsubscribe();
    }
}