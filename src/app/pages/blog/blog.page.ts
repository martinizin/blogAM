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
    let uploadUrl = '';
    let fileType = '';

    if (this.selectedFile) {
      const filePath = `posts/${new Date().getTime()}_${this.selectedFile.name}`;
      uploadUrl = await this.blogService.uploadFile(filePath, this.selectedFile);
      fileType = this.selectedFile.type;
      console.log('Upload URL:', uploadUrl);
    }

    await this.blogService.addPost(this.newPostContent, uploadUrl, fileType);
    this.newPostContent = '';
    this.selectedFile = null;
  }
}
