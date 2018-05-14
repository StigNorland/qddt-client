import {Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionItem } from '../../question/question.classes';
import { QddtMessageService } from '../../core/global/message.service';
import {ElementKind} from '../../shared/classes/enums';
import {HomeService} from '../home.service';
import {Concept} from '../home.classes';
import {IRevisionRef} from '../../shared/classes/interfaces';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-concept-treenode',
  providers: [  ],
  moduleId: module.id,
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent  {
  @Input() concept: any;
  @Input() readonly = false;
  @Output() deleteEvent =  new EventEmitter();
  @Output() updatedEvent =  new EventEmitter();

  public showConceptChildForm = false;
  public showbutton = false;
  private newchild: any;

  constructor(private conceptService: HomeService, private message: QddtMessageService) {
    this.newchild = new Concept();
  }

  onToggleEdit(edit) {
    edit.isVisible = !edit.isVisible;
    if (edit.isVisible) {
      this.conceptService.getConcept(this.concept.id).then(
        (result) => {
          this.concept = result;
        },
        (error) => {
          throw error;
        }
      );
    }
  }

  onCreateConcept(concept: any) {
    if (!this.readonly) {
      this.readonly = concept.archived;
    }
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onConceptSavedEvent(concept: any) {
    this.concept.version = concept.version;
    this.updatedEvent.emit(concept);
  }

  onConceptUpdated(concept: any) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: any) {
    this.deleteEvent.emit(concept);
  }

  onClickQuestionItem(questionItem: QuestionItem) {
    this.message.sendMessage( { element: questionItem, elementKind: ElementKind.QUESTION_ITEM } );
  }

  onChildSave() {
    this.showConceptChildForm = false;
    this.conceptService.createChildConcept(this.newchild, this.concept.id)
      .subscribe((result: any) => {
        this.concept.children.push(result);
      });
    this.newchild = new Concept();
  }

  removeQuestionItem(ref: IRevisionRef) {
    this.conceptService.deattachConceptQuestion(this.concept.id, ref.elementId , ref.elementRevision)
      .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  addQuestionItem(ref: IRevisionRef) {
      this.conceptService.attachConceptQuestion(this.concept.id, ref.elementId, ref.elementRevision)
        .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  getPdf(concept: Concept) {
    const fileName = concept.name + '.pdf';
    this.conceptService.getConceptPdf(concept.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }
}