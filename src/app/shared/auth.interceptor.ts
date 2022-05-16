import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
   
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = window.localStorage.getItem('token');
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + token
            }
        });
        return next.handle(req);
    }
}