import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SiteService, AtsI18nService } from 'core-foundation';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
    site: any;
    claims: any = {};
    chrome: any;
    siteJson: any;
    constructor(
        private siteService: SiteService,
        public atsI18nService: AtsI18nService
    ) { }

    ngOnInit() {
        this.getChromeI18nData();
    }
    getChromeI18nData() {   
        this.siteJson = this.siteService.getSiteJson()
        this.claims = this.siteJson.values.claims;
        this.site = this.siteJson.constants.i18n.site;
        this.chrome = this.siteService;
        this.chrome = this.chrome.site.constants.i18n.chrome;
        let i18nJson: any = {
            "site": this.site,
            "claims": this.claims,
            "chrome": this.chrome,
            "siteJson": this.siteJson
        };
        this.atsI18nService.initI18nJson(i18nJson);
    }
    @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
    public show = false;
    @ViewChild('anchor') public anchor: ElementRef;
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
    }
    public toggle(show?: boolean): void {
        this.show = show !== undefined ? show : !this.show;
    }
    private contains(target: any): boolean {
        return this.anchor.nativeElement.contains(target) ||
            (this.popup ? this.popup.nativeElement.contains(target) : false);
    }
}
