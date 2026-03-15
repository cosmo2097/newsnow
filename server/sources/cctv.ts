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

function createCCTVSearch(keyword: string) {
  return defineSource(async () => {
    const encodedKeyword = encodeURIComponent(keyword)
    const url = `https://search.cctv.com/ifsearch.php?page=1&qtext=${encodedKeyword}&sort=relevance&pageSize=20&type=video&vtime=-1&datepid=1&channel=&pageflag=0&qtext_str=${encodedKeyword}`
    const res = await myFetch<CCTVSearchRes>(url, {
      headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Referer": `https://search.cctv.com/search.php?qtext=${encodedKeyword}&type=video`,
        "X-Requested-With": "XMLHttpRequest",
      },
      parseResponse: JSON.parse,
    })

    if (!res?.list?.length) throw new Error("CCTV search returned no results")

    return res.list.map(item => ({
      id: item.id,
      title: item.all_title,
      url: item.urllink,
      pubDate: item.uploadtime,
      extra: {
        info: item.channel,
        img: item.imglink,
      },
    })).sort((a, b) => b.pubDate.localeCompare(a.pubDate))
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

export default defineSource({
  "cctv-wenzhou": createCCTVSearch("温州"),
  "cctv-xwlb": defineRSSSource("https://zmedia.66wz.net/xwlb/output/all.xml"),
  "cctv-xwlb-wenzhou": defineRSSSource("https://zmedia.66wz.net/xwlb/output/wenzhou.xml"),
  "cctv-hot": createCCTVHot(),
})
