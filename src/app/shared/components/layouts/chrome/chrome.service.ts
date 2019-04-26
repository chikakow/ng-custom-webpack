import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

const baseUrl = '../../api/layouts/chrome/chromebar/';
const AppListEndPoint = "../../api/layouts/chrome/apps/getapps";

@Injectable({
  providedIn: 'root'
})

export class ChromeService {    
    constructor(private http: HttpClient) {}

    gethistory() {  
        return this.http.get(baseUrl + 'gethistory');
    }

    getSettings() {         
        return this.http.get(baseUrl +'getsettings');       
    }

    getCompaniesAndBranches() {  
        return this.http.get(baseUrl +'getcompaniesandbranches');
    }
    getAppsList() {        
        return this.http.get(AppListEndPoint);
        
    }

}
