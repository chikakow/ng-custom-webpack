import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChromeService } from '../chrome.service';
import { SiteService,AtsI18nService} from 'core-foundation';

@Component({
    selector: 'app-company-branch',
    templateUrl: './company-branch.component.html',
    styleUrls: ['./company-branch.component.scss']
})
export class CompanyBranchComponent implements OnInit {
    branchName: string = '';
    companyName: string = '';
    responseData: any;
    chrome: any;
    isOverlayBusy: boolean;
    isOverlayError: boolean;
    companies: any;
    branches: any;
    private subscription: Subscription;
    constructor(
        private chromeService: ChromeService,
        private siteService: SiteService,
        private atsI18nService: AtsI18nService

    ) { }
    ngOnInit() {
        this.getChromeI18nData();
    }
    getChromeI18nData() {
        this.chrome = this.siteService.getSiteJson().constants.i18n.chrome;
    }
    loadGetCompaniesAndBranches() {
        this.responseData = null;
        this.isOverlayBusy = true;
        this.subscription = this.chromeService.getCompaniesAndBranches()
            .subscribe((data: any) => {
                if (data.companies.length > 0)
                    this.companyName = data.companies[0].companyName;
                if (data.branches.length > 0)
                    this.branchName = data.branches[0].branchName;
                this.responseData = data;
                this.companies = this.responseData.companies;
                this.branches = this.responseData.branches;
                this.isOverlayBusy = false;
                let i18nValues: any = {
                    "chrome": this.chrome,
                    "companyName": this.companyName,
                    "branchName": this.branchName,
                    "companies": this.companies,
                    "branches": this.branches
                }

                this.atsI18nService.initI18nJson(i18nValues);
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
    @ViewChild('anchor1') public anchor1: ElementRef;
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
        if (this.show && (event.srcElement.className == "fa fa-building-o fa-fw" || event.srcElement.className == "chrome-button pull-left")) {
            this.loadGetCompaniesAndBranches();
        }
    }
    public toggle(show?: boolean): void {
        this.show = show !== undefined ? show : !this.show;
    }
    private contains(target: any): boolean {
        return this.anchor1.nativeElement.contains(target) ||
            (this.popup ? this.popup.nativeElement.contains(target) : false);
    }

}
