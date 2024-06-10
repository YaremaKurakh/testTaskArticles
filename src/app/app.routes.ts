import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ArticleComponent} from "./components/article/article.component";

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: "full"},
  {path: 'home', component: HomeComponent},
  {path: 'article', component: ArticleComponent},
];
