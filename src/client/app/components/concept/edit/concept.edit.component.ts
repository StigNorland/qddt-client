import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ConceptService, Concept } from '../concept.service';
import 'rxjs/Rx';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-concept-edit',
  moduleId: module.id,
  providers: [ConceptService],
  template: `
  <div *ngIf="concept" class="row card" id="{{concept.id}}"  >
    <form (ngSubmit)="save()" #hf="ngForm">
      <div class="row input-field ">
        <label [attr.for]="concept.id + '-name'" class="teal-text">Name</label>
        <input id="{{concept?.id}}-name"
          name="{{concept?.id}}-name" type="text" [(ngModel)]="concept.name" required>
      </div>
      <div class="row input-field ">
        <label [attr.for]="concept.id + '-description'" class="teal-text">Description</label>
        <textarea class="materialize-textarea" id="{{concept?.id}}-description"
          name="{{concept?.id}}-description"
          [(ngModel)]="concept.description" required autosize></textarea>
      </div>
      <div class="row" *ngIf="!readonly">
        <qddt-rational [formName]="'RationalComp'" [element]="concept" [config]="{hidden: [2,3]}"></qddt-rational>
      </div>
      <div class="row">
        <qddt-element-footer [element]="concept" [type]="'concept'"
          (BasedonObjectDetail)="onBasedonObjectDetail($event)">
        </qddt-element-footer>
      </div>
      <div class="row" *ngIf="!readonly">
        <button type="submit" class="btn btn-default" [disabled]="!hf.form.valid" >Submit</button>
      </div>
    </form>
  </div>

  <div class="modal modal-fixed-footer"
    *ngIf="basedonObject"
    materialize="modal" [materializeActions]="basedonActions">
    <div class="modal-content">
      <h4>Basedon Object Detail</h4>
      <qddt-preview-concept [concept]="basedonObject"></qddt-preview-concept>
    </div>
    <div class="modal-footer">
      <button
        class="btn btn-default red modal-action modal-close waves-effect">
        <a><i class="close material-icons medium white-text">close</i></a>
      </button>
    </div>
  </div>
  `
})
export class ConceptEditComponent implements OnInit {

  @Input() concept: Concept;
  @Input() readonly: boolean;
  @Output() conceptSavedEvent: EventEmitter<any> = new EventEmitter<any>();
  basedonObject: any;
  basedonActions = new EventEmitter<string|MaterializeAction>();

  constructor(private service: ConceptService) {
  }

  ngOnInit() {
    this.basedonObject = null;
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  save() {
    this.service.updateConcept(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
        this.conceptSavedEvent.emit(result);
      }
        ,(err: any) => console.log('ERROR: ', err));
  }

  onAuthorSelected(author:any) {
    this.service.attachAuthor(this.concept.id,author.id);
    this.concept.authors.push(author);
  }

  onAuthorRemoved(author:any) {
    this.service.deattachAuthor(this.concept.id,author.id);
    var i = this.concept.authors.findIndex(F=>F===author);
    this.concept.authors.splice(i,1);
  }

  onBasedonObjectDetail(id: string) {
    this.service.getConcept(id)
      .subscribe(
      (result: any) => {
        this.basedonObject = result;
        this.basedonActions.emit({action:'modal', params:['open']});
        // this.basedonActions.emit({action:'modal', params:['open']});
      },
      (err: any) => null
      );
  }

}
