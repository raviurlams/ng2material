import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactServiceService {  

    public customersDatasource: any = [];
    public accountsDatasource: any = [];
    baseResourceUrl: string = 'http://54.172.191.22:8080/v1/biz/'; // getcontact

    //'./app/data/data.json'
    constructor(private httpService: Http) {};

    query(params ? : URLSearchParams): any {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.httpService
            //.get(this.baseResourceUrl + 'gettree', headers)
            .get('../app/data/sampledata.json', headers)
            .map((response) => {
                let contacts: any = response.json();
                return contacts.data;
            }).catch(this.handleError);
    };
    get(id: string, params ? : URLSearchParams): any {
        if (parseInt(id)) {
            var queryHeaders = new Headers();
            queryHeaders.append('Content-Type', 'application/json');
            return this.httpService
                //.get(this.baseResourceUrl + id, { headers: queryHeaders })
                .get('../app/data/' + id + '.json', queryHeaders)
                .map((response) => {
                    let contact: any = response.json();
                    return contact.data;
                }).catch(this.handleError);
        }
    };
    getContacts(params ? : URLSearchParams): any {       
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        return this.httpService
            //.get(this.baseResourceUrl + 'getcontact', { headers: queryHeaders })            
            .get('../app/data/data.json', queryHeaders)
            .map((response) => {
                let contact: any = response.json();
                return contact.data;
            }).catch(this.handleError);        
    };


     getmAddress(params ? : URLSearchParams): any {       
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        return this.httpService
            .get(this.baseResourceUrl + 'getadd', { headers: queryHeaders })            
            .map((response) => {
                let contact: any = response.json();
                return contact.data;
            }).catch(this.handleError);        
    };


    save(contact: any) {
        var queryHeaders = new Headers();
        //delete contact._id;       
        queryHeaders.append('Content-Type', 'application/json');//addcontact
        return this.httpService.post(this.baseResourceUrl + 'addcontact', JSON.stringify(contact), queryHeaders)
            .map((data: any) => {
                console.log(data);
                return data;
            }).catch(this.handleError);

    };
    getAddContacts(params ? : URLSearchParams): any {       
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        return this.httpService
            .get(this.baseResourceUrl + 'getadd', { headers: queryHeaders })            
            .map((response) => {
                let contact: any = response.json();
                return contact.data;
            }).catch(this.handleError);        
    };
    getSeq(params ? : URLSearchParams): any {       
        var queryHeaders = new Headers();
        queryHeaders.append('Content-Type', 'application/json');
        return this.httpService
            .get(this.baseResourceUrl + 'getSeq', { headers: queryHeaders })            
            .map((response) => {
                let contact: any = response.json();
                return contact.data[0].sequenceId+1;
            }).catch(this.handleError);        
    };
    getDefaultContact(){
        return JSON.parse('{"customerNbr":0,"path":[],"customerType":"","customerDescr":"","name":{"fname":"","lname":""},"addresses":[{"addressType":"billing","contact":[],"instructions":[],"addressIDs":[],"phy":[]},{"addressType":"mailing","contact":[],"instructions":[],"addressIDs":[],"phy":[]},{"addressType":"domicile","contact":[],"instructions":[],"addressIDs":[],"phy":[]}],"phone":[],"bank":[],"custStatus":{"review":"","purchase":""}}');
    };
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';       
        return Observable.throw(errMsg);
    };

}
