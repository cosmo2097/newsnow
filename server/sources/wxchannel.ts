interface WdVideoItem {
  id: string
  nickname: string
  objectDesc: {
    description: string
  }
  contact?: {
    liveCoverImgUrl?: string
  }
  objectExtend?: {
    monotonicData?: {
      countInfo?: {
        commentCount?: number
        likeCount?: number
        forwardCount?: number
        favCount?: number
      }
    }
  }
  createtime: number
  media: {
    coverUrl: string
    url: string
    thumbUrl?: string
  }[]
}

interface WdVideoResponse {
  data: {
    data: {
      object: WdVideoItem[]
    }
  }
}

function getChannel(username: string) {
  return defineSource(async () => {
    // The username in the URL query needs to be encoded or passed as is?
    // The original URL had ?username=v2_...
    // We will assume the passed username is already safe or use it directly.
    const url = `http://172.30.1.150:2026/api/channels/contact/feed/list?username=${username}`
    const res = await $fetch<WdVideoResponse>(url)

    const list = res.data?.data?.object || []

    return list.map(item => ({
      id: item.id,
      title: item.objectDesc?.description || "No Title",
      url: item.media?.[0]?.url || "#",
      pubDate: item.createtime * 1000,
      extra: {
        info: item.nickname,
        liveCoverImgUrl: item.contact?.liveCoverImgUrl,
        countInfo: item.objectExtend?.monotonicData?.countInfo,
      },
    }))
  })
}

export default defineSource({
  "wxchannel-wendu": getChannel("v2_060000231003b20faec8c4e08f11c0d5cd06e835b077ef6bd578ed1646fe6b673b7b7b7acd8a@finder"),
  "wxchannel-wzfabu": getChannel("v2_060000231003b20faec8c5e68d1ec4d3c70ce834b0775f1414636355ad90c2d6afe41ddbdbd1@finder"),
  "wxchannel-lcrongmei": getChannel("v2_060000231003b20faec8c7eb891ac1d7cf04eb34b077bd05110f3efdb54e8b77cf4a7a43492e@finder"),
  "wxchannel-lwrongmei": getChannel("v2_060000231003b20faec8c4e68119c3dccb0de831b0771e0aded10994993946d3fbb1a0dfc0cc@finder"),
  "wxchannel-ohrongmei": getChannel("v2_060000231003b20faec8c6ea891ecbdccb0ce83db0777b02eb6d4aa057c7ec30c1707481c0f9@finder"),
  "wxchannel-boruian": getChannel("v2_060000231003b20faec8c4e78c18c2d7cb07e837b077c8964e956d1d559c8b5b9201e5c9b288@finder"),
})
