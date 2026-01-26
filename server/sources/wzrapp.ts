import { myFetch } from "#/utils/fetch"

interface WzrappItem {
  id: number
  title: string
  content_url: string
  publish_time_stamp: number
  column_name: string
  [key: string]: any
}

interface WzrappSection {
  name: string
  data: WzrappItem[]
  [key: string]: any
}

interface WzrappResponse {
  data: WzrappSection[]
  [key: string]: any
}

export default defineSource(async () => {
  const url = "https://mapiplus.wzqmt.com/static/synews.json?site_id=1&client_type=2&count=20"

  const response = await myFetch(url)
  const json = typeof response === "string" ? JSON.parse(response) : response
  const sections = (json as WzrappResponse).data

  const block1 = sections.find(s => s.name === "区块一")?.data || []
  const bottom = sections.find(s => s.name === "底部新闻")?.data || []

  const items = [...block1, ...bottom]

  return items.map((item) => {
    return {
      id: `${item.id}`,
      title: item.title,
      url: item.content_url,
      pubDate: item.publish_time_stamp ? new Date(item.publish_time_stamp * 1000).toISOString() : undefined,
      // extra: {
      //     info: item.column_name,
      // },
    }
  })
})
