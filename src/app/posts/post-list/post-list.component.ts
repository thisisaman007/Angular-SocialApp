import { Component, OnDestroy, OnInit } from '@angular/core';
import {Post} from '../posts.model';
import { PostsService } from '../posts.service';
import {Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

posts: Post[]= [];
private postsSub: Subscription;
isLoading = false;
totalPosts = 0;
postsPerPage = 3;
currentPage = 1;
pageSizeOptions = [1,2,3,5,10];
private authStatusSub: Subscription;
userIsAuthenticated = false;
userId: string;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit(){
    this.isLoading = true;
     this.postsService.getPosts(this.postsPerPage, this.currentPage);
     this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }


  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() =>{
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () =>{
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
