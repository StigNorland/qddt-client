import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { QuestionService, QuestionItem, Question } from './question.service';
import { Change } from '../../common/change_status';

@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  providers: [QuestionService],
})

export class QuestionDetail implements OnInit {
  @Input() questionitem: QuestionItem;
  @Input() questionitems: QuestionItem[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter<any>();
  studyActions = new EventEmitter<string>();

  private revisionIsVisible: boolean;
  private editIsVisible: boolean;
  private conceptIsVisible: boolean;
  private config: any[];
  private selectedId: string;
  private selectedType: string;

  constructor(private service: QuestionService) {
    this.revisionIsVisible = false;
    this.editIsVisible = false;
    this.conceptIsVisible = false;
  }

  ngOnInit() {
    if(this.questionitem.question === null) {
      this.questionitem.question = new Question();
    }
    this.config = this.buildRevisionConfig();
  }

  hidDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onRemoveResponsedomain(questionitem: QuestionItem) {
    if (questionitem.responseDomain === undefined
      || questionitem.responseDomain.id === ''
      || questionitem.responseDomain.name === undefined) {
      return;
    }
    this.editIsVisible = false;
    questionitem.changeKind = Change.status[0][0];
    questionitem['changeComment'] = 'remove response domain ' + questionitem.responseDomain.name;
    questionitem.responseDomain = null;
    this.service.updateQuestionItem(questionitem)
      .subscribe((result: any) => {
        this.questionitem = result;
        this.editIsVisible = true;
      });
  }

  onEditQuestionItem(questionitem: QuestionItem) {
    let i = this.questionitems.findIndex(q => q['id'] === questionitem['id']);
    this.questionitems[i] = questionitem;
    this.hidDetail();
  }

  onClickStudy(id: string) {
    this.selectedId = id;
    this.selectedType = 'study';
    this.studyActions.emit('openModal');
  }

  onClickTopic(id: string) {
    this.selectedId = id;
    this.selectedType = 'topic';
    this.studyActions.emit('openModal');
  }

  onClickQuestion(id: string) {
    this.selectedId = id;
    this.selectedType = 'question';
    this.studyActions.emit('openModal');
  }

  private buildRevisionConfig(): any[] {
    let config: any[] = [];
    config.push({'name':'name','label':'Name'});
    config.push({'name':['question', 'question'],'label':'Question'});
    config.push({'name':['question', 'intent'],'label':'Intent'});
    config.push({'name':['responseDomain', 'name'],'label':'responseDomain'});
    config.push({'name':['responseDomain', 'version', 'major'],'label':'major'});
    config.push({'name':['responseDomain', 'version', 'minor'],'label':'minor'});

    return config;
  }

}
