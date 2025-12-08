import { URL } from "node:url"
import { Buffer } from "node:buffer"
import https from "node:https"
import * as cheerio from "cheerio"
import iconv from "iconv-lite"
import type { NewsItem } from "@shared/types"

const mainSite = defineSource(async () => {
  const url = "https://www.66wz.com/"
  const response: ArrayBuffer = await myFetch(url, { responseType: "arrayBuffer" })
  const html = iconv.decode(Buffer.from(response), "gb2312")
  const $ = cheerio.load(html)
  const items: NewsItem[] = $("#newslist ul li")
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

const agent = new https.Agent({
  rejectUnauthorized: false,
})

const countySite = defineSource(async () => {
  const url = "http://xs.66wz.com/"
  const response = await myFetch(url, {
    responseType: "arrayBuffer",
    agent,
  })

  const html = iconv.decode(Buffer.from(response), "gb2312")
  const $ = cheerio.load(html)
  const items: NewsItem[] = $("#grid li")
    .map((i, el) => {
      const titleElement = $(el).find("h4 a")
      const title = titleElement.text().trim()
      const relativeUrl = titleElement.attr("href") ?? ""
      const itemUrl = new URL(relativeUrl, url).href
      const imageUrl = $(el).find("img").attr("src")
      const county = $(el).find("h6 a").text()

      const dateMatch = $(el).find("h6").text().trim().match(/(\d{4}-\d{2}-\d{2})$/)
      let pubDate: string | undefined
      if (dateMatch) {
        pubDate = new Date(dateMatch[1]).toISOString()
      }

      const newsItem: NewsItem = {
        title,
        url: itemUrl,
        id: itemUrl,
        pubDate,
      }

      if (imageUrl) {
        newsItem.extra = {
          icon: {
            url: imageUrl,
            scale: 1,
          },
        }
      }

      if (county) {
        if (!newsItem.extra) {
          newsItem.extra = {}
        }
        newsItem.extra.info = county
      }

      return newsItem
    })
    .get()

  return items
})

export default defineSource({
  "66wz": mainSite,
  "66wz-main": mainSite,
  "66wz-county": countySite,
})
