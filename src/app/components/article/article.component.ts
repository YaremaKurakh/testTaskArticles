import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {

  article: any;
  text: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.article = JSON.parse(<string>this.route.snapshot.paramMap.get('article'))
    this.article.summary = `${this.text.repeat(50)}`
  }

}
