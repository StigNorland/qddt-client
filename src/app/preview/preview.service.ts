import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ElementKind, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';

export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}



@Injectable()
export class PreviewService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {  }

  getElementByKind(kind: ElementKind, id: string): Promise<any> {

    const qe = QDDT_ELEMENTS[kind];
    return this.http.get(this.api  + qe.path + '/' + id ).toPromise();
  }

  getRevisionByKind(kind: ElementKind, id: string, rev: number): Promise<any>  {

    const qe = QDDT_ELEMENTS[kind];
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();
  }

  getRevisionsByKind(kind: ElementKind, id: string): Promise<any> {

    const qe = QDDT_ELEMENTS[kind];
    if (qe) {
      if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
      } else {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
      }
    }
    return new Promise(null);
  }

  getFile(id: string): Promise<Blob> {

    return this.http.get(this.api + 'othermaterial/files/' + id, { responseType: 'blob'}).toPromise();
  }

}
