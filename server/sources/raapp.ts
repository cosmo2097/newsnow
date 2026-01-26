import { myFetch } from "#/utils/fetch"

interface RaappItem {
  id: number
  doc_title: string
  url: string
  published_at: number
  [key: string]: any
}

interface RaappResponse {
  data: {
    article_list: RaappItem[]
  }
  [key: string]: any
}

export default defineSource(async () => {
  const url = "https://vapp.tmuyun.com/api/article/channel_list?channel_id=619f0972b40eef3291d28394&isRecommend=0&is_new=1&size=20"

  const headers = {
    "Host": "vapp.tmuyun.com",
    "X-TIMESTAMP": "1769426835085",
    "JSSDK_FUNC_ID": "",
    "X-SESSION-ID": "69774f0dd859cc4dff11ba8c",
    "Accept": "*/*",
    "X-SIGNATURE": "e95fbc25fd5252b3db15851c1e91f00f45841451c9d0320177cdb30dd2a08d6d",
    "X-TENANT-ID": "48",
    "JSSDK_APP_ID": "",
    "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
    "X-REQUEST-ID": "B76E6533-E5C4-47C8-9BF1-99150A7FB16C",
    "User-Agent": "1.3.4;1139C8CE-D05B-4586-B8F9-432E02F6C97C-1044381696;iPhone14,5;IOS;26.2;Appstore;7.9.0",
    "X-Auth-Token": "",
    "YI-TOKEN": "",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": "acw_tc=1a0c39d217694267015667185e419ec4d2d57c383441ee9c186e0b30602be4",
  }

  const response = await myFetch(url, { headers }) as RaappResponse

  return response.data.article_list
    .filter(item => item.url) // Filter out items without URL (like the top list container)
    .map((item) => {
      return {
        id: `${item.id}`,
        title: item.doc_title,
        url: item.url,
        pubDate: item.published_at ? new Date(item.published_at).toISOString() : undefined,
      }
    })
})
