import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { PreviewModule } from './preview/preview.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';
import { PageNotFoundComponent } from './core/pagenotfound/page-not-found.component';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { ErrorLogService } from './core/errorhandler/error-log.service';
import { GlobalErrorHandler } from './core/errorhandler/error.service';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { ResponsedomainModule } from './responsedomain/responsedomain.module';
import { QuestionModule } from './question/question.module';
import { ControlConstructModule } from './controlconstruct/controlconstruct.module';
import { InstrumentModule } from './instrument/instrument.module';
import { PublicationModule } from './publication/publication.module';
import { TemplateModule } from './template/template.module';
import { TemplateService } from './template/template.service';
import { QuestionConstructModule } from './construct-question/question-construct.module';
import { SequenceModule } from './construct-sequence/sequence-construct.module';
import { MissingModule } from './category-missing/missing.module';
import { SelectorDialogsModule } from './selectors-dialog/selectors-dialog.module';

@NgModule({
  imports: [ BrowserModule, HttpClientModule,  SharedModule, CoreModule, HomeModule, MenuModule, SelectorDialogsModule,
    CategoryModule,  ResponsedomainModule, QuestionModule, ControlConstructModule, PreviewModule, MissingModule,
    InstrumentModule, PublicationModule, TemplateModule, QuestionConstructModule, SequenceModule, routing ],

    declarations: [ AppComponent, PageNotFoundComponent ],

    providers: [ ErrorLogService, TemplateService,
    { provide: APP_BASE_HREF, useValue: environment.APP_BASE },
    { provide: API_BASE_HREF, useValue: environment.API_BASE },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
