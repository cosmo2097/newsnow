import { load } from "cheerio"

interface CCTVSearchRes {
  total: number
  totalpage: number
  list: {
    id: string
    title: string
    all_title: string
    channel: string
    urllink: string
    imglink: string
    durations: number
    TV: string
    playtime: number
    uploadtime: string
  }[]
}

function createCCTVSearch(keywords: string | string[]) {
  const keywordList = Array.isArray(keywords) ? keywords : [keywords]
  return defineSource(async () => {
    const settledResults = await Promise.allSettled(
      keywordList.map(async (keyword) => {
        const encodedKeyword = encodeURIComponent(keyword)
        const url = `https://search.cctv.com/ifsearch.php?page=1&qtext=${encodedKeyword}&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=3&channel=&pageflag=0&qtext_str=${encodedKeyword}`
        const res = await myFetch<CCTVSearchRes>(url, {
          headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Referer": `https://search.cctv.com/search.php?qtext=${encodedKeyword}&type=video`,
            "X-Requested-With": "XMLHttpRequest",
          },
          parseResponse: JSON.parse,
        })
        return res?.list || []
      }),
    )

    const itemMap = new Map<string, any>()
    for (const result of settledResults) {
      if (result.status === "fulfilled") {
        for (const item of result.value) {
          if (item?.id && !itemMap.has(item.id)) {
            itemMap.set(item.id, {
              id: item.id,
              title: item.all_title,
              url: item.urllink,
              pubDate: item.uploadtime,
              extra: {
                info: item.channel,
                img: item.imglink,
              },
            })
          }
        }
      }
    }

    const items = Array.from(itemMap.values()).sort((a, b) => b.pubDate.localeCompare(a.pubDate))

    if (!items.length) throw new Error("CCTV search returned no results")

    return items
  })
}

function createCCTVHot() {
  return defineSource(async () => {
    const url = "https://tv.cctv.com/top/index.shtml"
    const html = await myFetch(url)
    const $ = load(html as string)
    const items: any[] = []

    // 选取热播榜所在的容器，根据用户提供的片段 id 为 SUBD1532335844492313
    $("#SUBD1532335844492313 li").each((_, el) => {
      const $el = $(el)
      const $titleA = $el.find(".text a")
      const title = $titleA.text().trim()
      const link = $titleA.attr("href")
      const $columnA = $el.find(".column a")
      const info = $columnA.text().trim()
      const img = $el.find(".image img").attr("lazy") || $el.find(".image img").attr("src")

      if (title && link) {
        items.push({
          id: link,
          title,
          url: link,
          extra: {
            info,
            img: img?.startsWith("//") ? `https:${img}` : img,
          },
        })
      }
    })

    if (!items.length) {
      // 备用方案：如果 ID 没匹配到，尝试匹配特定的 class
      $(".jiemuguanwang18043_bangdan_con01 ul li").each((_, el) => {
        const $el = $(el)
        const $titleA = $el.find(".text a")
        const title = $titleA.text().trim()
        const link = $titleA.attr("href")
        const $columnA = $el.find(".column a")
        const info = $columnA.text().trim()
        const img = $el.find(".image img").attr("lazy") || $el.find(".image img").attr("src")

        if (title && link && !items.find(i => i.url === link)) {
          items.push({
            id: link,
            title,
            url: link,
            extra: {
              info,
              img: img?.startsWith("//") ? `https:${img}` : img,
            },
          })
        }
      })
    }

    if (!items.length) throw new Error("CCTV hot list returned no results")

    return items
  })
}

const WENZHOU_KEYWORDS = [
  "温州",
  "鹿城",
  "龙湾",
  "瓯海",
  "洞头",
  "瑞安",
  "乐清",
  "龙港",
  "永嘉",
  "平阳",
  "苍南",
  "文成",
  "泰顺",
]

export default defineSource({
  "cctv-wenzhou": createCCTVSearch(WENZHOU_KEYWORDS),
  "cctv-xwlb": defineRSSSource("https://zmedia.66wz.net/xwlb/output/all.xml"),
  "cctv-xwlb-wenzhou": defineRSSSource("https://zmedia.66wz.net/xwlb/output/wenzhou.xml"),
  "cctv-hot": createCCTVHot(),
})
