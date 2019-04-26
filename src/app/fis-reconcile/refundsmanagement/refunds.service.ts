import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class RefundsService {

    constructor(private http: HttpClient) { }

    getcompany() {
        return this.http.get("../../api/layouts/site/companies/getcompany");
    }
    getgeneraterefundsdata(id: number) {
        return this.http.get("../../api/apps/refundsmanagement/refunds/getgeneraterefundsdata/" + id);
    }   
    savepreference(params1: any) {       
        return this.http.post("../../api/layouts/site/preferences/savepreference", params1);
    }
    getcustomerdetailsdata(id: number) {
        return this.http.get("../../api/apps/refundsmanagement/refunds/getcustomerdetailsdata/" + id + "/");
    }
    getcustomerdetailsdataReport(accountNumber: number, checkNo: number) {
        return this.http.get("../../api/apps/refundsmanagement/refunds/getcustomerdetailsdata/" + accountNumber + "/" + checkNo + "/");
    }
    getreportrefundsdata(id: number = 0,fromdate: any, todate: any, ) {
        return this.http.get("../../api/apps/refundsmanagement/refunds/getreportrefundsdata/" + id+"/" + fromdate + "/" + todate);
    }
    getJournalWithParameters(paramsData: any) {       
        const headers = new HttpHeaders()
            .append("model", JSON.stringify(paramsData));
        // headers.set
        return this.http.get('../../api/plugins/journal/journal/getjournalwithparameters/refundsmanagement.reportrefundsjournal/', { headers });
    }
    getJournal() {
        return this.http.get("../../api/plugins/journal/journal/getjournal/refundsmanagement.refundsjournal/")

    }
    getpotentialrefundstransfer() {
        return this.http.get("../../api/apps/refundsmanagement/refunds/getpotentialrefundstransfer");
    }
    getheldrefunds() {
        return this.http.get("../../api/apps/refundsmanagement/refunds/getheldrefunds");
    }   
}
