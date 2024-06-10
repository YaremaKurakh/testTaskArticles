export interface ArticleInterface {
  id: number,
  title: string,
  image_url: string,
  summary: string,
  published_at: string
}

export interface FormattedArticleInterface {
  "id": number,
  "title": string,
  "url": string,
  "image_url": string,
  "news_site": string,
  "summary": string,
  "published_at": string,
  "updated_at": string,
  "featured": true,
  "launches": [
    {
      "launch_id": string,
      "provider": string
    }
  ],
  "events": [
    {
      "event_id": number,
      "provider": string
    }
  ]
}

export interface CombinedReRequestArticleInterface {
  "results": FormattedArticleInterface[]
}

export interface RequestArticleInterface {
  "count": number,
  "next": string,
  "previous": string,
  "results": FormattedArticleInterface[]
}
