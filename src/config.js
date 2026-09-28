/**
 * 站点配置中心
 * 统一读取并派生 Vite 环境变量，组件层不再直接访问 import.meta.env
 */
import { version, author, github, home } from "../package.json";

// 应用信息（具名引入，构建时仅打包用到的字段）
export const appVersion = version;
export const appAuthor = author;
export const appGithub = github;
export const appHome = home;

const env = import.meta.env;

// 站点地址展示分段（如 ["xshan", "top"]），兼容带协议头的写法
export const siteHost = (() => {
  const url = env.VITE_SITE_URL;
  if (!url) return "imsyy.top".split(".");
  return url.replace(/^(https?:\/\/)/, "").split(".");
})();

// 站点链接（用于 href 跳转）
export const siteLink = (() => {
  const url = env.VITE_SITE_URL;
  if (!url) return "https://www.imsyy.top";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "//" + url;
  }
  return url;
})();

// 建站日期（YYYY-MM-DD 或 YYYY，未配置则为空）
export const siteStartDate = env.VITE_SITE_START;
// 建站年份（取前 4 位，未配置则为 null）
export const siteStartYear = siteStartDate?.length >= 4 ? siteStartDate.substring(0, 4) : null;

// 站点信息
export const siteName = env.VITE_SITE_NAME;
export const siteAuthor = env.VITE_SITE_AUTHOR;
export const siteLogo = env.VITE_SITE_MAIN_LOGO;

// 简介文本
export const descText = {
  hello: env.VITE_DESC_HELLO,
  text: env.VITE_DESC_TEXT,
  helloOther: env.VITE_DESC_HELLO_OTHER,
  textOther: env.VITE_DESC_TEXT_OTHER,
};

// 天气
export const weatherKey = env.VITE_WEATHER_KEY;

// 默认壁纸数量（构建期由 vite.config.js 统计 public/images 后注入，新增 / 删除壁纸无需改代码）
export const wallpaperCount = __WALLPAPER_COUNT__;

// 音乐播放器
export const songConfig = {
  api: env.VITE_SONG_API,
  server: env.VITE_SONG_SERVER || "netease",
  type: env.VITE_SONG_TYPE || "playlist",
  id: env.VITE_SONG_ID,
};
