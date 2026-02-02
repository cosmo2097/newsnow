import { myFetch } from "#/utils/fetch"

interface LcappItem {
  id: number
  doc_title: string
  url: string
  published_at: number
  [key: string]: any
}

interface LcappResponse {
  data: {
    article_list: LcappItem[]
  }
  [key: string]: any
}

export default defineSource(async () => {
  const url = "https://vapp.tmuyun.com/api/article/channel_list?channel_id=5d536248b19850248f2cd1a0&isRecommend=0&is_new=1&size=20"

  const headers = {
    "Host": "vapp.tmuyun.com",
    "X-TIMESTAMP": "1769427084582",
    "JSSDK_FUNC_ID": "",
    "X-SESSION-ID": "69775052f34e164ce0312825",
    "Accept": "*/*",
    "X-SIGNATURE": "6ed292459a6c5d29d44cd482e59cbc06734d6bfd67460d7d211bfca888fe404e",
    "X-TENANT-ID": "28",
    "JSSDK_APP_ID": "",
    "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
    "X-REQUEST-ID": "D7A1AE7D-5071-4912-91BF-C5F6182FB413",
    "User-Agent": "1.5.3;F4EDD9D6-BB44-4683-B8AE-3CB791FB299A322961408;iPhone14,5;IOS;26.2;Appstore;7.9.0",
    "X-Auth-Token": "",
    "YI-TOKEN": "",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": "acw_tc=0a47329c17694270261515719e8f1ce93dabadd72843e417c6a9917d33f714",
  }

  const response = await myFetch(url, { headers }) as LcappResponse

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
