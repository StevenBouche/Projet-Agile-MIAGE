import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthHttpInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log('intercepted request ... ');

        var token = this.auth.getAuth()?.jwtToken.accessToken;
        if(token!=undefined){
           const authReq : HttpRequest<any> = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${ token }`)
            });
           console.log('Sending request with new header auth now ...');
           return next.handle(authReq);
       }

        console.log('Sending request with no header auth ...');
        return next.handle(req);

    }

}
