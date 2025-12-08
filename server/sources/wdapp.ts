interface WzrbListItem {
  docId: string | number
  docTitle: string
  linkUrl: string
  pubTime: string
  source: string
}

interface WzrbResponse {
  docs: {
    list?: WzrbListItem[]
  }
}

async function getNewsData(path: string) {
  const url = `https://wdapp.wzrb.com.cn/app_pub/xw/${path}/`
  const res: WzrbResponse = await $fetch(url)

  const list = res.docs.list || []

  return list.map(item => ({
    id: item.docId,
    title: item.docTitle,
    url: item.linkUrl,
    pubDate: new Date(item.pubTime).getTime(),
    extra: {
      info: item.source,
    },
  }))
}

const ywNews = defineSource(async () => {
  return getNewsData("yw")
})

const tjNews = defineSource(async () => {
  return getNewsData("tj")
})

export default defineSource({
  "wdapp": ywNews,
  "wdapp-yw": ywNews,
  "wdapp-tj": tjNews,
})
