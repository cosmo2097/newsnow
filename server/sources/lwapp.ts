import { myFetch } from "#/utils/fetch"

interface LyappItem {
  id: number
  doc_title: string
  url: string
  published_at: number
  [key: string]: any
}

interface LyappResponse {
  data: {
    article_list: LyappItem[]
  }
  [key: string]: any
}

export default defineSource(async () => {
  const url = "https://vapp.tmuyun.com/api/article/channel_list?channel_id=6327c407fe3fc1537e563e31&isRecommend=0&is_new=1&size=20"

  const headers = {
    "Host": "vapp.tmuyun.com",
    "X-TIMESTAMP": "1769427202771",
    "JSSDK_FUNC_ID": "",
    "X-SESSION-ID": "697750c03cbc281b2d4468f7",
    "Accept": "*/*",
    "X-SIGNATURE": "c882fd866ca0cb0cb0a293070945755f4d17e492837a89ede67e4820689262a0",
    "X-TENANT-ID": "51",
    "JSSDK_APP_ID": "",
    "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
    "X-REQUEST-ID": "FEBA4408-45B1-4C15-8410-84C997E55F8D",
    "User-Agent": "3.5.2;2FACBC11-DA60-4225-ACFB-900E811C9544788529152;iPhone14,5;IOS;26.2;Appstore;7.8.0",
    "X-Auth-Token": "",
    "YI-TOKEN": "",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": "acw_tc=0aef832217694271363386709e09172f221acb4437e76c3cd6b759bb98d9a3",
  }

  const response = await myFetch(url, { headers }) as LyappResponse

  return response.data.article_list
    .filter(item => item.url)
    .map((item) => {
      return {
        id: `${item.id}`,
        title: item.doc_title,
        url: item.url,
        pubDate: item.published_at ? new Date(item.published_at).toISOString() : undefined,
      }
    })
})
