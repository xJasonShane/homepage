import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
// 引入 pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// swiper
import "swiper/css";
// 全局错误兜底
import { setupErrorHandler } from "@/utils/errorHandler.js";

const app = createApp(App);
setupErrorHandler(app);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.mount("#app");

// PWA（非安全上下文下 serviceWorker 不存在，需特性检测）
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // 弹出更新提醒
    console.log("站点已更新，刷新后生效");
    ElMessage("站点已更新，刷新后生效");
  });
}
