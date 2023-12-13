import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class JWTTokenService {
    jwtToken?: string;
    decodedToken?: { [key: string]: string };

    constructor() {
    }

    setToken(token: string) {
      if (token) {
        this.jwtToken = token;
      }
    }

    decodeToken() {
      if (this.jwtToken) {
      this.decodedToken = jwt_decode.jwtDecode(this.jwtToken);
      }
    }

    getDecodeToken() {
      return jwt_decode.jwtDecode(this.jwtToken ?? '');
    }

    getUserId() {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken['sub'] : null;
    }

    getUserEmail() {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken['sub'] : null;
    }

    getPermissions() {
      this.decodeToken();
      return this.decodedToken? this.decodedToken['permissions'] : null;
    }

    getExpiryTime() {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken['exp']: null;
    }

    isTokenExpired(): boolean {
      const expiryTime: number = Number(this.getExpiryTime());
      if (expiryTime) {
        return ((1000 * expiryTime) - (new Date()).getTime()) < 1800;
      } else {
        return false;
      }
    }
}