import { Component, Input, PipeTransform, Pipe } from '@angular/core';
import { BaseRequestOptions, Response, ResponseOptions, Http, ConnectionBackend } from '@angular/http';
import { TestBed, async } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';

import { RevisionService } from './revision.service';
import { BaseService } from '../../common/base.service';
import { RevisionDetailComponent } from './revision.detail.component';
import { API_BASE_HREF } from '../../api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';

export function main() {
	describe('Revision detail component', () => {
		//
		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [RevisionDetailComponent, LocalDatePipe,
					DiffComponent, ResponsedomainUsedbyComponent, QuestionUsedbyComponent,
					StudyUsedbyComponent, TopicUsedbyComponent, AuthorChipComponent],
				providers: [
					MockBackend,
					BaseRequestOptions,
					{ provide: RevisionService, useClass: RevisionServiceSpy },
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

		it('should work with null revision',
			async(() => {
				TestBed
					.compileComponents()
					.then(() => {
						let fixture = TestBed.createComponent(RevisionDetailComponent);
						fixture.detectChanges();
						let de: any = fixture.debugElement.queryAll(By.css('div'));
						expect(de.length).toBe(0);
					});
			}));

		it('should work with revisions',
			async(() => {
				TestBed
					.compileComponents()
					.then(() => {
						let fixture = TestBed.createComponent(RevisionDetailComponent);
						fixture.componentInstance.element = {
							'id': '7f000101-5582-1585-8155-e89cdeba0001',
							'modified': [2016, 7, 14, 10, 54, 2, 681000000],
							'modifiedBy': {
								'id': '83d4c30a-4ff9-11e5-885d-feff819cdc9f',
								'username': 'test',
								'email': 'test@nsd.no',
								'agency': null
							},
							'agency': {
								'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
								'modified': null,
								'modifiedBy': null,
								'name': 'NSD-qddt'
							},
							'name': 'test',
							'basedOnObject': null,
							'basedOnRevision': null,
							'version': {
								'major': 1,
								'minor': 0,
								'versionLabel': '',
								'revision': null
							},
							'changeKind': 'CREATED',
							'changeComment': null,
							'authors': [],
							'otherMaterials': [],
							'abstractDescription': 'test',
							'comments': [],
							'topicQuestions': {
								'id': '7f000101-5582-1585-8155-e89cdebb0002',
								'name': null,
								'modified': [2016, 7, 14, 10, 54, 2, 683000000],
								'modifiedBy': {
									'id': '83d4c30a-4ff9-11e5-885d-feff819cdc9f',
									'username': 'test',
									'email': 'test@nsd.no',
									'agency': {
										'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
										'name': 'NSD-qddt'
									}
								},
								'agency': {
									'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
									'name': 'NSD-qddt'
								},
								'basedOnObject': null,
								'version': {
									'major': 1,
									'minor': 0,
									'versionLabel': '',
									'revision': null
								},
								'changeKind': 'CREATED',
								'children': [],
								'questionItems': [],
								'label': null,
								'description': null,
								'comments': [],
								'topicRef': {
									'name': 'test',
									'id': '7f000101-5582-1585-8155-e89cdeba0001',
									'studyRef': {
										'name': 'ESS7',
										'id': '7f000101-54aa-131e-8154-aa2846a30001',
										'surveyRef': {
											'name': 'ESS',
											'id': '7f000101-54aa-131e-8154-aa27fc230000'
										}
									}
								}
							}
						};
						fixture.componentInstance.type = 'topic';
						fixture.detectChanges();
						fixture.whenStable().then(() => {
							let divs: any = fixture.debugElement.queryAll(By.css('.chip'));
							expect(divs.length).toBeGreaterThan(2);
							expect(divs[0].nativeNode.textContent).toContain('1.0');
							expect(divs[2].nativeNode.textContent).toContain('test');
						});
					});
			}));
	});
}

//override dependencies
class RevisionServiceSpy {
	getAllRevisions = jasmine.createSpy('getAllRevisions').and.callFake(function (key) {
		return [];
	});
}

@Component({
	selector: 'qddt-diff',
	template: `<div></div>`
})

class DiffComponent {
	@Input() compared: any;
	@Input() current: any;
	@Input() config: any;
	@Input() hideCompareEvent: any;
}

@Component({
	selector: 'qddt-responsedomain-usedby',
	template: `<div></div>`
})

class ResponsedomainUsedbyComponent {
	@Input() id: any;
}

@Component({
	selector: 'qddt-question-usedby',
	template: `<div></div>`
})

class QuestionUsedbyComponent {
	@Input() id: any;
}

@Component({
	selector: 'qddt-topic-usedby',
	template: `<div></div>`
})

class TopicUsedbyComponent {
	@Input() id: any;
}

@Component({
	selector: 'qddt-study-usedby',
	template: `<div></div>`
})

class StudyUsedbyComponent {
	@Input() id: any;
}

@Component({
	selector: 'qddt-author-chip',
	template: `<div></div>`
})

class AuthorChipComponent {
	@Input() authors: any;
}

@Pipe({
	name: 'localDate',
	pure: true
})
export class LocalDatePipe implements PipeTransform {

	transform(input: Array<number>): string {
		return '';
	}
}
