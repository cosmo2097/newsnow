import { Buffer } from "node:buffer"
import { XMLParser } from "fast-xml-parser"
import iconv from "iconv-lite"
import { myFetch } from "#/utils/fetch"

export default defineSource({
  wzyby: defineSource(async () => {
    const url = "https://www.wzyby.cn/rss/rss.xml"
    const response = await myFetch(url, { responseType: "arrayBuffer" })
    const xmlData = iconv.decode(Buffer.from(response), "gbk")

    const parser = new XMLParser()
    const result = parser.parse(xmlData)

    const items = result?.document?.item || []

    return items
      .map((item: any) => {
        if (!item.title || !item.link) {
          return null
        }
        return {
          title: item.title,
          url: item.link,
          id: item.link,
          pubDate: item.pubDate,
        }
      })
      .filter(Boolean)
  }),
})
