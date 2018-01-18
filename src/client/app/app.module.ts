import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { InstrumentModule } from './instrument/instrument.module';
import { PublicationModule } from './publication/publication.module';
import { ResponsedomainModule } from './responsedomain/responsedomain.module';
import { ControlConstructModule } from './controlconstruct/controlconstruct.module';
import { SequenceModule } from './sequence/sequence.module';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { CoreModule } from './core/core.module';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { GravatarModule } from 'ng2-gravatar-directive/src/gravatar.module';
import { MenuModule } from './menu/menu.module';
import { ErrorLogService } from './errorhandler/error-log.service';
import { GlobalErrorHandler } from './errorhandler/error.service';

@NgModule({
  declarations: [ AppComponent, PageNotFoundComponent ],
  imports: [ BrowserModule, HttpClientModule,  SharedModule, CoreModule, HomeModule, MenuModule,
    CategoryModule, ResponsedomainModule, QuestionModule, ControlConstructModule,
    SequenceModule, InstrumentModule, PublicationModule, GravatarModule, routing ],
  providers: [ ErrorLogService,
    { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
    { provide: API_BASE_HREF, useValue: '<%= API_BASE %>' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
