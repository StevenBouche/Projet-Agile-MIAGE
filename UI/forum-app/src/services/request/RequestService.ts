import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { kMaxLength } from 'buffer';
import { Observable, of } from 'rxjs';
import {  throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RequestService{

    constructor(private http: HttpClient) { }

    async executeGet<K>(url:string) : Promise<K> {
        var request = this.http.get<K>(url);
        return await this.executePromise<any>(request);
    }

    async executePost<T,K>(url: string, data: T = undefined) : Promise<K> {
        var request = this.http.post<K>(url, data);
        return await this.executePromise<K>(request);
    }

    async executePut<T,K>(url: string, data: T) : Promise<K> {
        var request = this.http.put<K>(url,data);
        return await this.executePromise<K>(request);
    }

    async executeDelete<K>(url:string) : Promise<K> {
        var request = this.http.delete<K>(url);
        return await this.executePromise<K>(request);
    }

    async getAddressIP() : Promise<string> {
        var request = this.http.get<any>("http://api.ipify.org/?format=json");
        var result = await this.executePromise<any>(request);
        return result.ip;
    }   

    private handleError<T>(operation = "operation", result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            // Server-side errors
            console.error(`Error Code: ${error.status}\nMessage: ${error.message}`);
            return of(error.error as T);
        };
      }

    async executePromise<K>(fun: Observable<K>) : Promise<K>  {
        return new Promise<K>((resolve,reject) => {
            fun.pipe(catchError(this.handleError("executeRequest")))      
            .subscribe((result:K) => {
                console.log(result)
                resolve(result);
            }, (error: any ) => {
                console.log(error)
                resolve(undefined)
            });
        });
    }

}