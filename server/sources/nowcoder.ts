interface Res {
  data: {
    result: {
      id: string
      title: string
      type: number
      uuid: string
    }[]
  }
}

export default defineSource(async () => {
  const timestamp = Date.now()
  const url = `https://gw-c.nowcoder.com/api/sparta/hot-search/top-hot-pc?size=20&_=${timestamp}&t=`
  const res: Res = await myFetch(url)
  const list: NewsItem[] = []
  for (const k of res.data.result) {
    let itemUrl: string | undefined
    let itemId: string | undefined
    if (k.type === 74) {
      itemUrl = `https://www.nowcoder.com/feed/main/detail/${k.uuid}`
      itemId = k.uuid
    } else if (k.type === 0) {
      itemUrl = `https://www.nowcoder.com/discuss/${k.id}`
      itemId = k.id
    }
    if (itemId && itemUrl && k.title) {
      list.push({
        id: itemId,
        title: k.title,
        url: itemUrl,
      })
    }
  }
  return list
})
