import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChromeService } from '../chrome.service';
import { SiteService } from 'core-foundation';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    responseData: any;
    chrome: any;
    private subscription: Subscription;
    isOverlayBusy: boolean;
    isOverlayError: boolean;
    constructor(
        private chromeService: ChromeService,
        private siteService: SiteService
    ) { }
    ngOnInit() {
        this.isOverlayBusy = false;
        this.getChromeI18nData();
    }
    getChromeI18nData() {
        this.chrome = this.siteService.getSiteJson().constants.i18n.chrome;        
    }
    loadSettings() {
        this.isOverlayBusy = true;
        this.subscription = this.chromeService.getSettings()
            .subscribe((data: any) => {
                this.responseData = data;
                this.isOverlayBusy = false;
            },error => {
                
                    this.isOverlayError = true;
                    ;
                });
    }
    ngOnDestroy() {
        if (this.subscription != null)
            this.subscription.unsubscribe();
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
        if (this.show) {
            this.loadSettings();
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
