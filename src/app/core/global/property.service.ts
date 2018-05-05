import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';


export enum HIERARCHY_POSITION {
  Survey,
  Study,
  Topic,
  Concept
}

/**
 *
 * In memmory store...
 */
@Injectable()
export class QddtPropertyStoreService {

  currentChange$: Observable<HIERARCHY_POSITION>;
  // Observable navItem source
  private _newcurrent = new BehaviorSubject<HIERARCHY_POSITION>(HIERARCHY_POSITION.Survey);

  private current: string = null;

  private globalObjects: Map<string, any> = new Map();

  constructor() {
    this.currentChange$ = this._newcurrent.asObservable();
  }

  set(key: string, value: any) {
    this.globalObjects.set(key, value);
  }

  get(key: string): any {
    return this.globalObjects.get(key) || '';
  }

  public setCurrent(pos: HIERARCHY_POSITION, name: string) {
    console.log('setCurrent ' + pos + ' - ' + name);
    this.current = name;
    this._newcurrent.next(pos);
  }

  public getCurrent(): any {
    return this.current;
  }


}
