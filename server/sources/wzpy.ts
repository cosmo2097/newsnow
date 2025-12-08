import { URL } from "node:url"
import * as cheerio from "cheerio"
import iconv from "iconv-lite"
import { myFetch } from "#/utils/fetch"

export default defineSource({
  wzpy: defineSource(async () => {
    const url = "https://news.66wz.com/piyao/rdzt/index.shtml"
    const response = await myFetch(url, { responseType: "arrayBuffer" })
    const html = iconv.decode(Buffer.from(response), "gb2312")
    const $ = cheerio.load(html)
    const items = $("ul.newslist li")
      .map((i, el) => {
        const titleElement = $(el).find("a")
        const title = titleElement.text().trim()
        const relativeUrl = titleElement.attr("href") ?? ""
        const itemUrl = new URL(relativeUrl, url).href
        const pubDate = $(el).find("em").text().trim()

        return {
          title,
          url: itemUrl,
          id: itemUrl,
          pubDate,
        }
      })
      .get()

    return items
  }),
})
