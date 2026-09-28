<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
    <span>{{ weatherData.adCode.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection?.endsWith("风")
          ? weatherData.weather.winddirection
          : weatherData.weather.winddirection + "风"
      }}&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { getAdcode, getWeather, getOtherWeather } from "@/api";
import LocalStorageCache from "@/utils/cache.js";
import { errorToast } from "@/utils/toast.js";
import { weatherKey } from "@/config";

// 高德开发者 Key
const mainKey = weatherKey;

// 天气数据
const weatherData = reactive({
  adCode: {
    city: null, // 城市
    adcode: null, // 城市编码
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 创建缓存实例（10分钟过期）
const weatherCache = new LocalStorageCache("weather_cache", 10 * 60 * 1000);

// 取出天气平均值
const getTemperature = (min, max) => {
  try {
    // 计算平均值并四舍五入
    const average = (Number(min) + Number(max)) / 2;
    return Math.round(average);
  } catch (error) {
    console.error("计算温度出现错误：", error);
    return "NaN";
  }
};

// 高德天气（主）：IP 定位 + 实况天气
const fetchFromAmap = async () => {
  const adCode = await getAdcode(mainKey);
  // infocode 10000 但 adcode 为空数组/空串的情况同样视为失效
  if (adCode.infocode !== "10000" || typeof adCode.adcode !== "string" || !adCode.adcode) {
    throw new Error("高德地区查询失败");
  }
  const result = await getWeather(mainKey, adCode.adcode);
  const live = result.lives?.[0];
  if (!live) {
    throw new Error("高德天气数据为空");
  }
  return {
    adCode: {
      city: adCode.city,
      adcode: adCode.adcode,
    },
    weather: {
      weather: live.weather,
      temperature: live.temperature,
      winddirection: live.winddirection,
      windpower: live.windpower,
    },
  };
};

// 教书先生天气（备）：未配置 Key 或高德失效时使用
const fetchFromOther = async () => {
  const result = await getOtherWeather();
  const data = result.result;
  return {
    adCode: {
      city: data.city.City || "未知地区",
    },
    weather: {
      weather: data.condition.day_weather,
      temperature: getTemperature(data.condition.min_degree, data.condition.max_degree),
      winddirection: data.condition.day_wind_direction,
      windpower: data.condition.day_wind_power,
    },
  };
};

// 数据源按优先级排列，与歌曲 API 一致：主源失效自动回退下一源
const weatherProviders = [
  { name: "高德天气", fetch: fetchFromAmap, enabled: Boolean(mainKey) },
  { name: "备用天气", fetch: fetchFromOther, enabled: true },
];

// 获取天气数据
const getWeatherData = async () => {
  // 先尝试从缓存获取
  const cached = weatherCache.get();
  if (cached) {
    weatherData.adCode = cached.adCode;
    weatherData.weather = cached.weather;
    return;
  }

  let lastError;
  for (const provider of weatherProviders) {
    if (!provider.enabled) continue;
    try {
      const data = await provider.fetch();
      weatherData.adCode = data.adCode;
      weatherData.weather = data.weather;
      // 缓存天气数据
      weatherCache.set({
        adCode: { ...data.adCode },
        weather: { ...data.weather },
      });
      return;
    } catch (error) {
      console.error(`天气接口（${provider.name}）请求失败:`, error);
      lastError = error;
    }
  }
  console.error("天气信息获取失败:" + lastError);
  onError("天气信息获取失败");
};

// 报错信息
const onError = (message) => {
  errorToast(message);
  console.error(message);
};

onMounted(() => {
  // 延迟加载天气数据，优先显示页面
  setTimeout(() => {
    getWeatherData();
  }, 1500);
});
</script>
