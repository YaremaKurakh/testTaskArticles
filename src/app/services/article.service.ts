import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, of, switchMap} from "rxjs";
import moment from "moment";
import {
  ArticleInterface,
  CombinedReRequestArticleInterface, FormattedArticleInterface,
  RequestArticleInterface
} from "../interfaces/article.interface";

//I have some questions about prioritizing the search query, so I implemented 2 methods to get the search results//

@Injectable()
export class ArticleService {

  private url: string = 'https://api.spaceflightnewsapi.net/v4/articles'

  private limit = 100;

  constructor(private http: HttpClient) {
  }

  getArticlesV1(keyWord?: string) { //This method receive search results by title, and if there are less than 100, it receives search results by summary so that there are 100 articles in total//
    if (!keyWord) {
      return this.http.get<RequestArticleInterface>(this.url, { params: { limit: this.limit, offset: 0  } })
      .pipe(
        map((res: RequestArticleInterface) => this.articleMapper(res.results))
      );
    }

    let temporaryRes: RequestArticleInterface;

    return this.http.get<RequestArticleInterface>(this.url, { params: { limit: this.limit, offset: 0, title_contains_one: keyWord  } })
      .pipe(
        switchMap((res: RequestArticleInterface) => {
          if (res.count >= this.limit) {
            return of(res);
          }
          temporaryRes = res;
          return this.http.get<RequestArticleInterface>(this.url, { params: { limit: this.limit - res.count, offset: 0, summary_contains_one: keyWord  } })
        }),
        switchMap((res: RequestArticleInterface) => {
          if (!temporaryRes) {
            return of(res);
          }
          return of({
            count: 0,
            next: res.next,
            previous: temporaryRes.previous,
            results: [
              ...temporaryRes.results,
              ...res.results,
            ]
          });
        }),
        map((res: RequestArticleInterface) => this.articleMapper(res.results))
      );
  }


  getArticlesV2(keyWord?: string) { //This method receive 50 search results by title and 50 by summary//
    if (!keyWord) {
      return this.http.get<RequestArticleInterface>(this.url, { params: { limit: this.limit, offset: 0  } }).pipe(map((res: RequestArticleInterface) => {
        return this.articleMapper(res.results)
      }))
    }

    this.limit = 50;

    const titleRequest = this.http.get<RequestArticleInterface>(this.url, { params: { limit: this.limit, offset: 0, title_contains_one: keyWord  } });
    const summaryRequest = this.http.get<RequestArticleInterface>(this.url, { params: { limit: this.limit, offset: 0, summary_contains_one: keyWord  } });

    return forkJoin([titleRequest, summaryRequest])
      .pipe(
        map((responses: CombinedReRequestArticleInterface[]) => {
        const combinedResults = [...responses[0].results, ...responses[1].results];
        return this.articleMapper(combinedResults);
      })
    );
  }

  articleMapper(articles: FormattedArticleInterface[]) {
    return articles.map((item:FormattedArticleInterface): ArticleInterface => ({
      id: item.id,
      title: item.title,
      image_url: item.image_url,
      summary: item.summary,
      published_at: moment(item.published_at).format('MMMM Do YYYY')
    }));
  }


}
