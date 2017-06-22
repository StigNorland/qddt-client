import { NgModule } from '@angular/core';
import { RevisionModule } from '../../common/revision/revision.module';
import { CompareModule } from '../../common/compare/compare.module';
import { CommentModule } from '../../common/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { ControlConstructComponent } from './controlconstruct.component';
import { ControlConstructDetailComponent } from './controlconstruct.detail.component';
import { InstructionComponent } from './instruction.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';
import { ControlConstructQuestionItemSelectComponent } from './controlconstruct.questionitem.select.component';
import { ControlConstructFormComponent } from './controlconstruct.form.component';
import { PreviewModule } from '../../common/preview/preview.module';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule,
    ResponsedomainModule, QuestionModule, PreviewModule],
  declarations: [ControlConstructComponent, ControlConstructFormComponent,
    ControlConstructQuestionItemSelectComponent, ControlConstructDetailComponent, InstructionComponent
    ],
  exports: [ControlConstructComponent]
})

export class ControlConstructModule { }
