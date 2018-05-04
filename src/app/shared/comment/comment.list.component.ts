import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from './comment.service';
import { IComment } from '../classes/interfaces';

@Component({
  selector: 'qddt-comment-list',
  moduleId: module.id,
  styles: [`img { border-radius: 50%; width: 48px; float: right; position: relative; top: 8px; }`],
  templateUrl: `./comment.list.component.html`,
  providers: [CommentService]
})

export class CommentListComponent implements OnInit {
  @Input() ownerId: string;
  @Input() comments: IComment[];
  @Input() showPrivate = true;
  isEditComment = false;
  isPublic = true;
  selectedCommentId: number;
  message = '';
  showComments = false;

  constructor(private commentService: CommentService) {
    this.selectedCommentId = 0;
  }

  ngOnInit() {
    if (this.comments === null || this.comments === undefined) {
      this.comments = [];
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments) {
      this.addedComment();
    }
  }

  addedComment() {
    this.commentService.getAll(this.ownerId)
      .then((result: any) => this.comments = result.content);
  }

  onDeleteComment(idx: number) {
    const comment = this.comments[idx];
    this.commentService.delete(comment.id)
      .subscribe(() => this.comments.splice(idx, 1));
  }

  onUpdateComment(idx: number) {
    this.isEditComment = false;
    if (this.comments.length > idx) {
      const comment = this.comments[idx];
      if (this.message !== comment.comment || this.isPublic !== comment.public) {
        comment.comment = this.message;
        comment.public = this.isPublic;
        this.commentService.update(comment).subscribe((result: any) => {
          this.comments[idx] = result;
        });
      }
    }
  }

}
