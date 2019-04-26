import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';



@NgModule({
    declarations: [],
    imports: [
        // ! IMPORTANT ! - Import only as needed - please comment unused modules!
        CommonModule,
        TooltipModule,
        ButtonsModule,
        PopupModule,
        DialogsModule, 
        GridModule,
        DropDownsModule, 
        ExcelExportModule,
        DateInputsModule,
        PDFModule
        
        
    ],
    exports: [
        // ! IMPORTANT ! - Export only as needed - please comment unused modules!
        CommonModule,
        TooltipModule,
        ButtonsModule,
        PopupModule,
        DialogsModule,
        GridModule,
        DropDownsModule,
        ExcelModule,
        DateInputsModule,
        PDFModule
       
    ]
})
export class KendoUiAngularModule { }
