import {  Component, OnInit } from '@angular/core';
import { StudyService, Study } from './study.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SurveyProgram } from '../survey/survey.service';

const saveAs = require('file-saver');

@Component({
  selector: 'qddt-study',
  moduleId: module.id,
  templateUrl: './study.component.html',
  providers: [StudyService],
})
export class StudyComponent implements OnInit {
  showEditForm = false;
  private study: any;
  private survey: SurveyProgram;

  constructor(  private router: Router, private route: ActivatedRoute,
                private studyService: StudyService, private auth: AuthService) {
    this.study = new Study();
  }

  ngOnInit(): void {
    let survey= this.auth.getGlobalObject('survey');
    if (survey) {
      this.survey = survey;
    } else {
      this.route.paramMap.switchMap((params: ParamMap) => {
        this.survey.id = params.get('surveyId');
        this.studyService.getAll(this.survey.id).then(result=> this.survey.studies = result);
        return null;
      });
    }
  }

  onStudySelect(study: any) {
    this.auth.setGlobalObject('study',study);
    this.router.navigate(['topic/',study.id]);
  }

  onToggleStudyForm() {
    this.showEditForm = !this.showEditForm;
  }

  onStudySavedEvent(study: any) {
    let studies = this.survey.studies;
    this.survey.studies =studies.filter((s: any) => s.id !== study.id).concat(study);
  }

  onSaveNewStudy() {
    this.showEditForm = false;
    this.studyService.save(this.study, this.survey.id)
      .subscribe((result: any) => {
        this.onStudySavedEvent(result);
    });
    this.study  = new Study();
  }

  getPdf(element: Study) {
    const fileName = element.name + '.pdf';
    this.studyService.getPdf(element.id).then(
      (data: any) => {
        saveAs(data, fileName);
      });
  }

  onRemoveStudy(studyId: string) {
    if (studyId && studyId.length === 36) {
      let studies = this.survey.studies;
      this.studyService.deleteStudy(studyId)
        .subscribe(() =>
          this.survey.studies = studies.filter(q => q['id'] === studyId));
    }
  }
}
