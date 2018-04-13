import { ElementKind } from './enums';
import { IElement, IIdRef, IRevisionRef, IVersion } from './interfaces';

export class ElementRevisionRef implements IIdRef, IRevisionRef, IElement {
  elementId: string;
  elementRevision: number;
  elementKind: ElementKind | string;
  element: any;
  name?: string;
  version?: IVersion;
}

export class QueryInfo {
  id: ElementKind;
  label: string;
  path: string;
  fields: any[];
  parameter: string;

  constructor(id: ElementKind, label: string, path: string, fields: any[], parameter: string) {
    this.id = id;
    this.label = label;
    this.path = path;
    this.fields = fields;
    this.parameter = parameter;
  }

  isMultipleFields(): boolean {
    return (this.fields.length > 1);
  }

  placeholder(): string {
    let message = 'Searches in [';
    this.fields.forEach(o => {
      message += o + ' and ';
    });
    return message.slice(0, message.length - 5) + ']';
  }
}

/*
   * number: the current page beginning with zero
   * size: the size of each page
   * totalElements: the total number of elements
   * totalPages: the total pages
*/

export class Page {
  number = 0;
  size = 10;
  totalElements?: number;
  totalPages?: number;
  sort = '';  // default to no sort

  public constructor(init?: Partial<Page>) {
    Object.assign(this, init);
  }


  public queryPage(): string {
    let query = '&page=' + this.number.toString();
    query += '&size=' + this.getSize();
    query += (this.sort) ? '&sort=' + this.sort : '';
    return query;
  }

  private getSize(): string {
    return (this.size) ? this.size.toString() : '10';
  }
}
