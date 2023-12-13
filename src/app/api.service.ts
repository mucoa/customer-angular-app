import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LocalStorageService } from './local.storage.service';
import { ToastService } from '@siemens/ix-angular';
import { Router } from '@angular/router';
import { JwtDecodeOptions } from 'jwt-decode';
import { JWTTokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiBaseUrl: string | undefined;

    constructor(private http: HttpClient,
        private storageService: LocalStorageService,
        private toastService: ToastService,
        private tokenService: JWTTokenService,
        private router: Router) {
        this.apiBaseUrl = environment.apiBaseUrl
    }

    checkUserPermission(permission: string) {
        return (new Map(Object.entries(this.tokenService.getDecodeToken()))
            .get('permissions') as string[]).includes(permission);
    }

    userLoggedOut() {
        this.toastService.show({
            title: 'Session Expired, Unauthorized',
            message: 'Your session expired or you are not authorized, please sign in again.',
            type: 'error',
        });
        this.storageService.remove('token');
        this.router.navigate(['/login']);
    }

    get(data: {
        endpoint: string,
        parameters?: string,
        isAuthenticationRequired: boolean | false
    }): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('content-type', 'application/json');
        headers = headers.set('Access-Control-Allow-Origin', '*');

        if (data.isAuthenticationRequired) {
            const token = this.storageService.get('token');
            headers = headers.set('Authorization', `Bearer ${token}`)
        }

        return this.http.get<any>(`${this.apiBaseUrl}/${data.endpoint}${(data.parameters !== undefined) ? `?${data.parameters}` : ''}`,
            {
                observe: 'response',
                headers: headers
            }
        );
    }

    put(data: {
        endpoint: string,
        body?: object,
        parameters?: string,
        isAuthenticationRequired: boolean | false
    }): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('content-type', 'application/json');
        headers = headers.set('Access-Control-Allow-Origin', '*');

        if (data.isAuthenticationRequired) {
            const token = this.storageService.get('token');
            headers = headers.set('Authorization', `Bearer ${token}`)
        }

        return this.http.put<any>(`${this.apiBaseUrl}/${data.endpoint}`,
            JSON.stringify(data.body),
            {
                observe: 'response',
                headers: headers
            }
        );
    };

    delete(data: {
        endpoint: string,
        body?: object,
        parameters?: string,
        isAuthenticationRequired: boolean | false
    }): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('content-type', 'application/json');
        headers = headers.set('Access-Control-Allow-Origin', '*');

        if (data.isAuthenticationRequired) {
            const token = this.storageService.get('token');
            headers = headers.set('Authorization', `Bearer ${token}`)
        }

        return this.http.delete<any>(`${this.apiBaseUrl}/${data.endpoint}`,
            {
                body: JSON.stringify(data.body),
                observe: 'response',
                headers: headers
            }
        );
    };


    post(data: {
        endpoint: string,
        body?: object,
        parameters?: string,
        isAuthenticationRequired: boolean | false
    }): Observable<any> {
        let headers = new HttpHeaders();
        headers = headers.set('content-type', 'application/json');
        headers = headers.set('Access-Control-Allow-Origin', '*');

        if (data.isAuthenticationRequired) {
            const token = this.storageService.get('token');
            headers = headers.set('Authorization', `Bearer ${token}`)
        }

        return this.http.post<any>(`${this.apiBaseUrl}/${data.endpoint}`,
            JSON.stringify(data.body),
            {
                observe: 'response',
                headers: headers
            }
        );
    }
}