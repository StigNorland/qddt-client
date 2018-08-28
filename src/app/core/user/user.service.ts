
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { API_BASE_HREF } from '../../api';
import { User } from './user';
import { IAuthority, UserJson } from '../../user/user.classes';
import { ActionKind, ElementKind } from '../../shared/classes/enums';
import { AuthorityKind } from './authority';

export const TOKEN_NAME = 'jwt_token';
const LAST_LOGIN = 'EMAIL_LAST_LOGIN';

export class Agency  {
  id: string;
  name: string;
}

export class ResetPassword {
  id: string;
  oldPassword: string;
  password: string;

  public constructor(init?: Partial<ResetPassword>) {
    Object.assign(this, init);
  }
}

export interface IPassword {
  id: string;
  oldPassword: string;
  password: string;
  confirm?: string;
}

/**
 * UserService uses JSON-Web-Token authorization strategy.
 * Fetched token and user details are stored in localStorage.
 */
@Injectable()
export class UserService {
  public static readonly SIGNIN_URL = 'auth/signin';
  public static readonly ANGENCY_URL = 'agency/all';
  public static readonly RESET_PWD_URL = 'user/resetpassword';
  public static readonly UPDATE_URL = 'user';
  public static readonly AUTHORITY_URL = 'authority/all';
  private static readonly USERINFO = 'user';

  loginChanged$: Observable<string>;
  // Observable navItem source
  private _newcurrent = new BehaviorSubject<string>('');

  private _user: User;
  private _roles: number;


  constructor(private http: HttpClient,  @Inject(API_BASE_HREF) private api: string) {
    this.loginChanged$ = this._newcurrent.asObservable();
    if (this.isTokenExpired()) {
      this.logout();
    } else {
      this.loadUserFromToken();
    }
  }

  public canDo(action: ActionKind, kind: ElementKind): boolean {

    function canRead(roles: number) {
      if (roles >= +AuthorityKind.ROLE_VIEW) {
        return true;
      } else {
        return (kind === ElementKind.PUBLICATION);
      }
    }

    function canUpdate(roles: number) {
      if (kind === ElementKind.USER && roles < AuthorityKind.ROLE_ADMIN ) {
        return false;
      } else if (roles >= +AuthorityKind.ROLE_EDITOR) {
        return true;
      } else if (roles >= +AuthorityKind.ROLE_CONCEPT) {
        return (kind === ElementKind.TOPIC_GROUP || kind ===  ElementKind.CONCEPT);
      } else {
        return false;
      }
    }

    function canDelete(roles: number) {
      if (roles >= +AuthorityKind.ROLE_ADMIN) {
        return true;
      } else if (roles >= +AuthorityKind.ROLE_EDITOR ) {
        return ( kind !== ElementKind.SURVEY_PROGRAM && kind !== ElementKind.STUDY );
      } else {
        return false;
      }
    }

    switch (action) {
      case ActionKind.Read:
        return canRead(this._roles);
      case ActionKind.Create:
      case ActionKind.Update:
        return canUpdate(this._roles);
      case ActionKind.Delete:
        return canDelete(this._roles);
      default:
        return false;
    }
  }

  public getUser(): User {
    return this._user || new User();
  }

  public async signIn(email: string, password: string) {

    const requestParam = {
      email: email,
      password: password
    };

    const response = await this.http.post<any>(this.api + UserService.SIGNIN_URL, requestParam).toPromise();
    if (response && response.token) {
      this.setToken(response.token);
    } else {
      console.log('login failed');
    }
    return response;
  }

  public save(userdata: UserJson): Observable<any> {
    return this.http.post(this.api + UserService.UPDATE_URL, userdata);
  }

  public resetPassword(password: IPassword): Observable<any> {
    if (!password.id) {
        password.id = this.getUserId();
    }
    console.log((password.id));
    return this.http.post(this.api + UserService.RESET_PWD_URL, password);
  }

  public getAgencies(): Promise<Agency[]> {
    return this.http.get<Agency[]>( this.api + UserService.ANGENCY_URL).toPromise();
  }

  public getAuthories(): Promise<IAuthority[]> {
    return this.http.get<IAuthority[]>( this.api + UserService.AUTHORITY_URL).toPromise();
  }

  /**
   * Removes token and user details from localStorage and service's variables
   */
  public logout(): void {
    localStorage.removeItem(TOKEN_NAME);
    this._newcurrent.next('');
  }

  public isTokenExpired(): boolean {
    if (!this.getToken()) { return true; }

    const expire = new Date(0);
    expire.setUTCSeconds(this.getUser().exp);
    if (expire === undefined) {
      console.log('usr exp undefined ->' + this.getUsername());
      return true;
    }
    const clientTime = new Date();
    const diff = expire.getTime() - clientTime.getTime();
    return  (diff < 0 );
  }

  public getUsername(): string {
    return this.getUser().sub || 'no name';
  }

  public getUserId(): string {
    console.log('getUserId->' + this.getUser().id);
    return this.getUser().id || '';
  }

  public  getEmail(): string {
    return this.getUser().email || localStorage.getItem(LAST_LOGIN) || '';
  }

  public  getRoles(): string[] {
    if ((this.getUser().role) && this.getUser().role instanceof Array ) {
      return this.getUser().role.map( e => e.authority);
    } else {
      return [];
    }
  }


  public getToken(): string {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token === 'undefined') {
      return null;
    } else {
      return token;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
    this.loadUserFromToken();
  }

  private loadUserFromToken(): void {
    this._user = this.getTokenClaims(this.getToken());
    localStorage.setItem(LAST_LOGIN, this._user.email);
    this._roles = 0;
    this.getRoles().forEach((role) => this._roles += +AuthorityKind[role]);
    this._newcurrent.next(this.getUser().sub);
  }

  // Retrieves user details from token
  private getTokenClaims(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}
