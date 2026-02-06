import process from "node:process"

const host = process.env.WECHAT2RSS_HOST || "http://192.168.203.118:8088"

export default defineSource({
  "wechatmp-wzljl": defineRSSSource(`${host}/feed/3096617131.xml`),
  "wechatmp-xianzheng": defineRSSSource(`${host}/feed/3263163758.xml`),
  "wechatmp-wrzz": defineRSSSource(`${host}/feed/3931324350.xml`),
  "wechatmp-wawz": defineRSSSource(`${host}/feed/3597663934.xml`),
  "wechatmp-oysk": defineRSSSource(`${host}/feed/3875566412.xml`),
  "wechatmp-wzlsyx": defineRSSSource(`${host}/feed/3585127816.xml`),
  "wechatmp-wzfsz": defineRSSSource(`${host}/feed/3900214185.xml`),
  "wechatmp-wzcgxw": defineRSSSource(`${host}/feed/3943265683.xml`),
  "wechatmp-wzddd": defineRSSSource(`${host}/feed/3877770503.xml`),
  "wechatmp-wzdsb": defineRSSSource(`${host}/feed/3890531418.xml`),
  "wechatmp-wzwb": defineRSSSource(`${host}/feed/2395115200.xml`),
  "wechatmp-wzrb": defineRSSSource(`${host}/feed/3879659870.xml`),
  "wechatmp-ohfb": defineRSSSource(`${host}/feed/3096137476.xml`),
  "wechatmp-lcfb": defineRSSSource(`${host}/feed/2393324403.xml`),
  "wechatmp-lwfb": defineRSSSource(`${host}/feed/3011383587.xml`),
  "wechatmp-dtfb": defineRSSSource(`${host}/feed/3536299976.xml`),
  "wechatmp-yjfb": defineRSSSource(`${host}/feed/3074012794.xml`),
  "wechatmp-pyfb": defineRSSSource(`${host}/feed/3287164539.xml`),
  "wechatmp-cnfb": defineRSSSource(`${host}/feed/3098853037.xml`),
  "wechatmp-wcfb": defineRSSSource(`${host}/feed/3075251009.xml`),
  "wechatmp-tsfb": defineRSSSource(`${host}/feed/3078041361.xml`),
  "wechatmp-rafb": defineRSSSource(`${host}/feed/2390159685.xml`),
  "wechatmp-yqfb": defineRSSSource(`${host}/feed/2393144905.xml`),
  "wechatmp-lgfb": defineRSSSource(`${host}/feed/3079351131.xml`),
  "wechatmp-zww": defineRSSSource(`${host}/feed/3237033630.xml`),
})
