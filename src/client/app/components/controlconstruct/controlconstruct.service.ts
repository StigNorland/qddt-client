import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { QuestionItem } from '../question/question.service';

export class ControlConstruct {
  id: string;
  name: string;
  description: string;
  questionItem: QuestionItem;
  otherMaterials: any;
  controlConstructKind: string;
  preInstructions: Instruction[];
  postInstructions: Instruction[];
}

export class Instruction {
  id: string;
  description: string;
}

@Injectable()
export class ControlConstructService extends BaseService {

  readonly pageSize = '&size=10';

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  create(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/create');
  }

  getControlConstruct(id: string): any {
    return this.get('controlconstruct/' + id);
  }

  uploadFile(id: string, files: any): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    if(files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id, formData, options)
      .map((res:any) => {
        try {
          return res.json();
        } catch (e) {
          return [];
        }
      })
      .catch(this.handleError);
  }

  deleteFile(id: string) {
    return this.delete('othermaterial/delete/' + id);
  }

  getFile(id: string) {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'othermaterial/files/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }

  update(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/');
  }

  getControlConstructsByQuestionItem(id: string): any {
    return this.get('controlconstruct/list/by-question/' + id);
  }

  getQuestionItems(key: string): any {
    return this.get('questionitem/page');
  }

  getQuestionItemsRevisions(id: string) : any {
    return this.get('audit/questionitem/' + id + '/all');
  }

  deleteControlConstruct(id: string): any {
    return this.delete('controlconstruct/delete/' + id);
  }

  searchQuestionItemsByNameAndQuestion(name: string = '', page: String = '0', sort: String = ''): any {
    let query = name.length > 0? '&question=' + '*' + name +'*' + '&name=' + '*' + name +'*': '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('questionitem/page/search?' + 'page=' + page + this.pageSize + query);
  }

  searchInstructions(description: string = '', page: String = '0'): any {
    let query = description.length > 0? '&description=' + '*' + description +'*': '';
    return this.get('instruction/page/search?' + 'page=' + page + this.pageSize + query);
  }

  getConceptsByQuestionitemId(id: string) {
    return this.get('concept/list/by-QuestionItem/'+ id);
  }

  searchControlConstructs(key: string = '', page: String = '0', sort: string = ''): any {
    let query = key.length > 0? '&name=' + '*' + key +'*'
      + '&questionname=' + '*' + key +'*'
      + '&questiontext=' + '*' + key +'*': '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('controlconstruct/page/search?constructkind=QUESTION_CONSTRUCT' + '&page=' + page + this.pageSize + query);
  }

  getPdf(id: string): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'controlconstruct/pdf/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }
}
