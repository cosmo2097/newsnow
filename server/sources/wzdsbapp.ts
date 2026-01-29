import { myFetch } from "#/utils/fetch"

interface WzdsbappItem {
  contentid: number
  title: string
  thumb: string
  sorttime: number
  [key: string]: any
}

interface WzdsbappResponse {
  data: WzdsbappItem[]
  [key: string]: any
}

const getMain = defineSource(async () => {
  const url = "https://api.wendu.cn/mobile/index.php?action=index&app=mobile&catid=31&controller=content&page=1&size=20"

  const response = await myFetch(url)
  const json = typeof response === "string" ? JSON.parse(response) : response
  const data = (json as WzdsbappResponse).data

  return data.map((item) => {
    return {
      id: `${item.contentid}`,
      title: item.title,
      url: `https://wap.wendu.cn/article/id/${item.contentid}`,
      pubDate: item.sorttime ? new Date(item.sorttime * 1000).toISOString() : undefined,
      // extra: {
      //     img: item.thumb,
      // },
    }
  })
})

export default defineSource({
  "wzdsbapp": getMain,
  "wzdsbapp-main": getMain,
})
