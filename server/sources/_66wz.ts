import { URL } from "node:url"
import * as cheerio from "cheerio"
import iconv from "iconv-lite"
import { myFetch } from "#/utils/fetch"

const mainSite = defineSource(async () => {
  const url = "https://www.66wz.com/"
  const response = await myFetch(url, { responseType: "arrayBuffer" })
  const html = iconv.decode(Buffer.from(response), "gb2312")
  const $ = cheerio.load(html)
  const items = $("#newslist ul li")
    .map((i, el) => {
      const titleElement = $(el).find("a")
      const title = titleElement.text().trim()
      const relativeUrl = titleElement.attr("href") ?? ""
      const itemUrl = new URL(relativeUrl, url).href

      const dateMatch = itemUrl.match(/\/system\/(\d{4})\/(\d{2})\/(\d{2})\//)
      let pubDate: string | undefined
      if (dateMatch) {
        const year = dateMatch[1]
        const month = dateMatch[2]
        const day = dateMatch[3]
        pubDate = new Date(`${year}-${month}-${day}`).toISOString()
      }

      return {
        title,
        url: itemUrl,
        id: itemUrl,
        pubDate,
      }
    })
    .get()

  return items
})

export default defineSource({
  "66wz": mainSite,
  "66wz-main": mainSite,
})
