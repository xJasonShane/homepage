import fetchJsonp from "fetch-jsonp";
import { songConfig } from "@/config";

/**
 * 音乐播放器
 */

// 默认请求超时时间（毫秒）
const REQUEST_TIMEOUT = 10000;

/**
 * 带超时与状态校验的 JSON 请求
 * @param {string} url 请求地址
 * @param {number} timeout 超时时间（毫秒）
 * @returns {Promise<any>} 解析后的 JSON 数据
 */
const requestJson = async (url, timeout = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`接口请求失败（HTTP ${res.status}）`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`接口请求超时（${timeout / 1000}s）`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const data = await requestJson(
    `${songConfig.api}?server=${server}&type=${type}&id=${id}`,
  );

  // 校验响应结构：必须为非空数组，避免后续取值报错
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("音乐接口返回数据为空");
  }

  if (typeof data[0].url === "string" && data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const sipList = jsonpData?.req_0?.data?.sip;
    const midurlList = jsonpData?.req_0?.data?.midurlinfo;
    if (!Array.isArray(sipList) || !Array.isArray(midurlList)) {
      throw new Error("音乐直链解析失败（JSONP 响应结构异常）");
    }
    const domain = (
      sipList.find((i) => !i.startsWith("http://ws")) || sipList[0]
    ).replace("http://", "https://");

    return data
      .map((v, i) => ({
        name: v.name || v.title,
        artist: v.artist || v.author,
        url: domain + (midurlList[i]?.purl || ""),
        cover: v.cover || v.pic,
        lrc: v.lrc,
      }))
      .filter((v) => v.url);
  } else {
    // 过滤掉缺少播放地址的无效条目
    return data
      .map((v) => ({
        name: v.name || v.title,
        artist: v.artist || v.author,
        url: v.url,
        cover: v.cover || v.pic,
        lrc: v.lrc,
      }))
      .filter((v) => v.url);
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  return await requestJson("https://v1.hitokoto.cn");
};

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  return await requestJson(`https://restapi.amap.com/v3/ip?key=${key}`);
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  return await requestJson(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
  const result = await requestJson("https://api.oioweb.cn/api/weather/GetWeather");
  // 校验响应结构，避免调用方取值时报错
  if (!result?.result) {
    throw new Error("备用天气接口返回数据异常");
  }
  return result;
};
