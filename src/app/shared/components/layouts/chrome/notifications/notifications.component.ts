import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SiteService, AtsI18nService } from 'core-foundation';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    chrome: any;
    constructor(
        private siteService: SiteService,
        public atsI18nService: AtsI18nService
    ) { }
    ngOnInit() {
        this.getChromeI18nData();
    }
    getChromeI18nData() {
        this.chrome = this.siteService.getSiteJson().constants.i18n.chrome;   
        this.atsI18nService.initI18nJson(this.chrome);
    }

    @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
    public show = false;
    @ViewChild('anchorNotification') public anchor: ElementRef;
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
