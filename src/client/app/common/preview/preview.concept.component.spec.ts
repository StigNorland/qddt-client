import { Component, Input } from '@angular/core';
import { BaseRequestOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { PublicationService } from '../../components/publication/publication.service';
import { PreviewConceptComponent } from './preview.concept.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
  describe('Publication concept preview component', () => {
    //
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ PreviewConceptComponent, CommentListComponent,
          ConceptPreviewQuestionitemComponent],
        providers: [
          MockBackend,
          BaseRequestOptions,
          { provide: PublicationService, useClass: PublicationServiceSpy },
          {
            provide: Http,
            useFactory: (backend: ConnectionBackend, options: BaseRequestOptions) => new Http(backend, options),
            deps: [MockBackend, BaseRequestOptions]
          },
          {
            provide: API_BASE_HREF,
            useValue: '<%= API_BASE %>'
          }
        ],
        imports: [CommonModule, FormsModule, MaterializeModule]
      });
    });

    it('should work with null',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewConceptComponent);
            fixture.detectChanges();
            let de: any = fixture.debugElement.queryAll(By.css('div'));
            expect(de.length).toBe(0);
          });
      }));

    it('should work with concepts',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(PreviewConceptComponent);
            let element: any = {
                'id' : '7f000101-54aa-131e-8154-aa27fc230000',
                'modified' : [ 2016, 9, 8, 15, 21, 26, 254000000 ],
                'name' : 'one concept',
                'description' : 'one concept',
                'children': [],
                'comments': [],
                'conceptQuestionItems': [],
                'basedOnObject' : null,
                'basedOnRevision' : null,
                'version' : {'major' : 6, 'minor' : 0, 'versionLabel' : '', 'revision' : null },
                'changeKind' : 'CONCEPTUAL',
                'changeComment' : 'Information added'
            };
            fixture.componentInstance.concept = element;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              let de: any = fixture.debugElement.queryAll(By.css('li'));
              expect(de.length).toBeGreaterThan(0);
              expect(de[0].nativeNode.textContent).toContain('concept');
            });
          });
      }));
  });
}

//override dependencies
class PublicationServiceSpy {
  searchPublications = jasmine.createSpy('searchPublications').and.callFake(function (key) {
    return [];
  });
}

@Component({
  selector: 'qddt-comment-list',
  template: `<div></div>`
})

class CommentListComponent {
  @Input() ownerId: any;
  @Input() comments: any;
}

@Component({
  selector: 'qddt-preview-questionitem',
  template: `<div></div>`
})

class ConceptPreviewQuestionitemComponent {
  @Input() questionItem: any;
  @Input() concept: any;
  @Input() editResponseDomain: boolean;
}
