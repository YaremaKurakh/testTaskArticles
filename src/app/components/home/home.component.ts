import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ArticleService} from "../../services/article.service";
import {debounceTime, map, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {ArticleInterface} from "../../interfaces/article.interface";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
    MatGridList,
    MatGridTile,
    NgForOf,
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  providers: [
    ArticleService
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{

  constructor(private router: Router,
              private fb: FormBuilder,
              private articleService: ArticleService) {
  }

  keyword!: FormControl;
  isLoading: boolean = true;
  allowToHighlight: boolean = false;
  resultAmount?: number;
  articles: ArticleInterface[] = [];
  destroy$ = new Subject();

  ngOnInit() {
    this.initControl();
    this.articleService.getArticlesV1('')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res : ArticleInterface[]) => {
        this.articles = res;
        this.resultAmount = this.articles.length;
        this.isLoading = false
      });
    this.search();
  }

  initControl () {
    this.keyword = this.fb.control('');
  }

  redirectToArticle(article: ArticleInterface) {
    this.router.navigate(["article", {article: JSON.stringify(article)}]);
  }

  search() {
    this.keyword.valueChanges
      .pipe(
        debounceTime(500),
        map(value => {
          this.isLoading = true;
          this.articles = [];
          this.articleService.getArticlesV1(value.replace(/ /g, ','))
            .pipe(takeUntil(this.destroy$))
            .subscribe((res : ArticleInterface[]) => {
              this.articles = res;
              this.resultAmount = this.articles.length;
              this.isLoading = false;
              this.allowToHighlight = true;
            })
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  highlightMatch(text: string) {
    if (this.allowToHighlight) {
      if (!this.keyword.value) {
        return text;
      }
      const keywords = this.getKeywordsAsArray();
      const pattern = new RegExp('(\\b|\\B)(' + keywords.join('|') + ')(\\b|\\B)', 'gi');

      return text.replace(pattern, function(match, p1, p2, p3) {
        if (p1 === '' && p3 === '') {
          return p1 + '<span>' + p2 + '</span>' + p3;
        } else {
          return match;
        }
      });
    } return text;
  }

  getKeywordsAsArray() {
    if (!this.keyword.value) return [];
    return this.keyword.value.trim().split(' ');
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
