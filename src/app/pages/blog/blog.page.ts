import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  posts$: Observable<any[]>;
  newPostContent: string = '';
  selectedFile: File | null = null;

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.posts$ = this.blogService.getPosts();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile);
  }

  async addPost() {
    let imageUrl = '';
    if (this.selectedFile) {
      const filePath = `posts/${new Date().getTime()}_${this.selectedFile.name}`;
      imageUrl = await this.blogService.uploadImage(filePath, this.selectedFile);
      console.log('Image URL:', imageUrl);
    }

    await this.blogService.addPost(this.newPostContent, imageUrl);
    this.newPostContent = '';
    this.selectedFile = null;
  }
}
