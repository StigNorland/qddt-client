import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../responsedomain/responsedomain.classes';
import { Category } from '../../category/category.classes';

@Component({
  selector: 'qddt-preview-rd-codelist',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="responseDomain">
     <ul>
       <li *ngFor="let row of rows" class="row">
         <input name="{{responseDomain?.id}}-codegroup" type="{{type}}"
           id="{{responseDomain?.id}}code{{row?.code}}"
           [disabled]="row.disabled"
           (change)="checkOption(row, $event)"/>
         <label [attr.for]="responseDomain.id + 'code' + row.code">{{ row?.label }}</label>
         <span class="right"> {{ row?.code }}</span>
       </li>
     </ul>
     </div>`,
  styles: [],
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Input() managedRepresentation: Category;
  @Input() responseCardinality = 1;
  public rows: any[] = [];
  public type: string;
  private max = 4;
  private min = 1;
  private responseMax: number;

  ngOnChanges() {
    this.rows = [];
    const rep = this.managedRepresentation;
    this.max = rep.inputLimit.maximum;
    this.min = rep.inputLimit.minimum;
    let categories: Category[] = [];
    if (rep.children ) {
      categories = rep.children;
    }
    for (const c of categories) {
      this.rows.push({ 'label': c.label, 'code': c.code.codeValue, 'checked': false });
    }
    this.type = 'radio';
    if (this.responseCardinality > 1) {
      this.type = 'checkbox';
    }
  }

  checkOption(row: any, event: any) {
    row.checked = event.target.checked;
    if (this.type === 'checkbox') {
      if (this.rows.filter((e: any) => e.checked).length >= this.responseMax) {
        this.rows.filter((e: any) => !e.checked).forEach(e => e.disabled = 'disabled');
      } else {
        this.rows.forEach((e: any) => e.disabled = '');
      }
    }
  }
}
