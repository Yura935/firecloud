import { Component, OnInit } from '@angular/core';
import { IBlog } from '../../interfaces/blog.interface';
import { BlogService } from '../../services/blog.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  userBlogs: Array<IBlog> = [];
  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    this.getBlogs();
  }

  getBlogs(): void {
    this.blogService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.userBlogs = data;
    });
  }
}
