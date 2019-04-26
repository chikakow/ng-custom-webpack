import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AtsI18nService, SiteService } from 'core-foundation';
//import { ScriptService } from 'core-foundation';

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

    angular: any = {};
    siteModule: any = {};
    isShowChrome: boolean = true;

    constructor(
        private AtsI18nService: AtsI18nService,
        private siteService: SiteService
    ) { }

    ngOnInit() {
  
        let url: string ="../../api/layouts/site/miniportal/getminiportalviewmodel/1";
        this.siteService.getAngularObject(url).subscribe((data: any) => {
 
            this.angular = data;
            // this.scriptService.setAngularData(data);
            //window['angular'] = this.angular;
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerText = "angular.atsServerValues = " + JSON.stringify(data.atsServerValues);   //"var angularString = '" + JSON.stringify(data) + "';" + " var angular = JSON.parse(angularString);";
            document.getElementsByTagName('head')[0].appendChild(script);

            //// add scripts to DOM
            //this.scriptService.loadFoundationScripts().then(data => {
            //    console.log('script loaded ', data);
            //}).catch(error => console.log(error));
            this.initSite();
        });

  
    }

    initSite() {
      
        this.siteModule.values = {
            locale: this.angular.atsServerValues.locale,
            isAuthenticated: this.angular.atsServerValues.isAuthenticated,
            claims: this.angular.atsServerValues.claims,
            enforceSettings: this.angular.atsServerValues.enforceSettings
        };

        this.siteModule.constants = {};

        this.siteModule.constants.site = {
            appId: this.angular.atsServerValues.appId,
            app: this.angular.atsServerValues.app,
            appUrls: this.angular.atsServerValues.appUrls,
            companyId: this.angular.atsServerValues.companyId,
            days: {
                sunday: 'sunday',
                monday: 'monday',
                tuesday: 'tuesday',
                wednesday: 'wednesday',
                thursday: 'thursday',
                friday: 'friday',
                saturday: 'saturday'
            },
            monthNos: {
                january: 0,
                february: 1,
                march: 2,
                april: 3,
                may: 4,
                june: 5,
                july: 6,
                august: 7,
                september: 8,
                october: 9,
                november: 10,
                december: 11
            },
            title: this.angular.atsServerValues.title,
            key: {
                enter: 13,
                escape: 27,
                space: 32,
                up: 38,
                down: 40,
                tab: 9
            },
            modalCloseMethod: {
                x: 'x', //user closed modal with the X
                esc: 'esc', //user closed modal with the ESC button
                back: 'back', //user closed modal with browser Back button
                code: 'code' //user activated code within the modal that closed the modal
            },
            inputsFocus: 'button, input, select, textarea, area, object, optgroup, option, ' +
                '.km-switch, .k-widget.k-treeview, .k-widget.k-menu, k-widget.k-tabstrip',
            inputsDisabled: 'button, input, select, textarea, area, object, optgroup, option, ' +
                'ats-togglebuttons, .km-widget.km-switch .km-widget, ats-fileupload',
            focusPriority: {
                high: 1,
                medium: 2,
                low: 3
            },
            showCompanyBanners: false, //individual apps may turn this back to true
            pathBase: this.angular.atsServerValues.pathBase,
            internalSourceSegment: this.angular.atsServerValues.internalSourceSegment,
            externalSourceSegment: this.angular.atsServerValues.externalSourceSegment,
            internalModules: this.angular.atsServerValues.internalModules,
            icons: {
                pos: '<i class="fa fa-check-circle-o fa-lg text-success"> </i>',
                neg: '<i class="fa fa-times-circle-o fa-lg text-danger"> </i>',
                ban: '<i class="fa fa-ban fa-lg text-info"></i>'
            },
            classes: {
                posIcon: 'fa fa-check-circle-o fa-lg text-success',
                negIcon: 'fa fa-times-circle-o fa-lg text-danger',
                banIcon: 'fa fa-ban fa-lg text-info'
            }

        };

        //TODO: should this be unders site (constants.site.patterns) or should more site stuff be moved out of site?
        this.siteModule.constants.patterns = {
            ein: '^[0-9]{9}$',                      //without formatting
            usPhone: '^[0-9]{10}$',                 //without formatting
            ssn: '^[0-9]{9}$',                      //without formatting
            zip: '^[0-9]{5}$|^[0-9]{9}$',           //without formatting
            glNumber: '^[0-9]{7}$',
            cprNo: '^[0-9]{7}$',
            phoneExt: '^[0-9]{1,6}$',
            creditCardNumber: '^[0-9]{16}$',
            routingNumber: '^[0-9]{9}$'
        }; //Email is not needed, Kendo enforces this with 'type'

        //kendo-related constants
        //we will expand on these constants in locale-config
        this.siteModule.constants.k = {
            theme: 'material', //TODO: drive this via config?
            masks: {
                creditCardNumber: '0000 0000 0000 0000',
                usPhone: '(000) 000-0000',
                ssn: '000-00-0000'
            }
        };

        //angular-related constants
        //we will expand on these constants in locale-config
        this.siteModule.constants.ng = {
        };

        // Browser's userAgent constants
        let agent = window.navigator.userAgent.toLowerCase();

        this.siteModule.constants.userAgent = {
            agent: window.navigator.userAgent,
            isMac: agent.indexOf('mac os') > -1,
            isWindows: agent.indexOf('windows') > -1,
            isFirefox: agent.indexOf('firefox') > -1,
            isChrome: agent.indexOf('chrome') > -1,
            isIE: agent.indexOf('trident') > -1,
            isEdge: agent.indexOf('edge') > -1
        };

        this.siteModule.constants.userAgent.isMS = this.siteModule.constants.userAgent.isIE || this.siteModule.constants.userAgent.isEdge;

        let newk = {},
            newng = {};

        // use lodash to merge for locale specific formats
        switch (this.siteModule.values.locale.toLowerCase()) {
            case "en-us":
                newk = {
                    defaultDateFormat: 'M/d/yyyy',
                    altDateFormats: ['MM/dd/yyyy', 'MMM d, yyyy', 'MMMM d, yyyy'],
                    yearOnly: 'yyyy',
                    creditCardExpDate: 'MM/yyyy',
                    dayMonthOnly: 'dd-MMM'
                };
                this.siteModule.constants.k = _.merge(this.siteModule.constants.k, newk);

                newng = {
                    shortDate: 'shortDate',
                    creditCardExpDate: 'MM/yyyy',
                    mediumDate: 'mediumDate',
                    medium: 'medium',
                    longDate: 'longDate',
                    fullDate: 'fullDate',
                    shortTime: 'shortTime',
                    longMonthYear: 'MMMM yyyy',
                    shortMonthYear: 'M/y',
                    timestamp: 'MMM d, y h:mm a',
                    mediumDateShortTime: 'MMM d, y h:mm a',
                    dayMonthOnly: 'dd-MMM'
                };
                this.siteModule.constants.ng = _.merge(this.siteModule.constants.ng, newng);
                break;
            case "es-us":
                newk = {
                    defaultDateFormat: 'd/M/yyyy',
                    altDateFormats: ['dd/MM/yyyy', 'd MMM yyyy', 'd MMMM yyyy', 'd \'de\' MMMM \'de\' yyyy'],
                    yearOnly: 'yyyy',
                    creditCardExpDate: 'MM/yyyy',
                    dayMonthOnly: 'dd-MMM'
                };
                this.siteModule.constants.k = _.merge(this.siteModule.constants.k, newk);

                newng = {
                    shortDate: 'shortDate',
                    creditCardExpDate: 'MM/yyyy',
                    mediumDate: 'mediumDate',
                    medium: 'medium',
                    longDate: 'longDate',
                    fullDate: 'fullDate',
                    shortTime: 'shortTime',
                    longMonthYear: 'MMMM yyyy',
                    shortMonthYear: 'M/y',
                    timestamp: 'MMM d, y h:mm a',
                    mediumDateShortTime: 'd MMM y h:mm a',
                    dayMonthOnly: 'dd-MMM'
                };
                this.siteModule.constants.ng = _.merge(this.siteModule.constants.ng, newng);
                break;
        }

    
        this.siteService.setAngularObject(this.angular);

        if (this.angular.atsServerValues.i18nJson !== null) {
            this.AtsI18nService.processI18nJson(this.siteModule.constants, this.angular);
            this.siteService.setSiteJson(this.siteModule);
        }

        this.angular = this.siteService.getAngularJson();
        this.isShowChrome = true;
    }

    enforceI18nLibraryHierarchy(i18n) {
        let higherLibraries = {};
        let lowerLibraries = {};

        // value: library, key: libraryName
        Object.keys(i18n).forEach(function (libraryName) {
            if (libraryName == 'site' || libraryName == 'chrome' || libraryName == 'app') {
                higherLibraries[libraryName] = true;
            }
            else {
                lowerLibraries[libraryName] = true;
            }
        });

        // key: lowerLibrary
        Object.keys(lowerLibraries).forEach((lowerLibrary) => {
            Object.keys(i18n[lowerLibrary]).forEach((key) => {
                Object.keys(higherLibraries).forEach((higherLibrary) => {
                    this.checkForDuplicateI18nToken(i18n, higherLibrary, key);
                });
            });
        });

        
    }

    checkForDuplicateI18nToken(i18n, libraryName, key) {
        if (i18n[libraryName][key]) {
            throw new Error('i18n ' + libraryName + '.' + key + ' should not be re-defined in a lower library.');
        }
    }

}