/**
 * 全局错误兜底
 * 收集三类错误并统一降级提示，避免异常导致页面异常且无诊断信息：
 * 1. Vue 渲染 / 生命周期 / 侦听器错误（app.config.errorHandler）
 * 2. 组件外未捕获的脚本错误（window error）
 * 3. 未处理的 Promise 拒绝（unhandledrejection）
 * 所有错误始终保留 console 输出以便调试；提示经节流与防递归保护
 * （资源加载失败不在捕获范围，由各组件既有的 error 兜底自行处理）
 */
import { h } from "vue";
// 注意：icon-park 的 Error 图标必须别名导入，
// 否则会遮蔽全局 Error 构造器，导致 new Error / instanceof Error 全部失效
import { Error as ErrorIcon } from "@icon-park/vue-next";

// 提示节流间隔：错误风暴时最多每 5s 弹一次
const TOAST_INTERVAL = 5000;
let lastToastTime = 0;
// 防递归标记：提示过程自身再出错时直接忽略
let reporting = false;

const showErrorToast = (message) => {
  if (reporting) return;
  const now = Date.now();
  if (now - lastToastTime < TOAST_INTERVAL) return;
  lastToastTime = now;
  reporting = true;
  try {
    ElMessage({
      message,
      grouping: true,
      icon: h(ErrorIcon, { theme: "filled", fill: "#efefef" }),
    });
  } finally {
    reporting = false;
  }
};

// 统一处理：始终保留 console 便于排查；开发环境提示具体信息，生产环境降级为通用文案
const handleError = (error, from) => {
  console.error(`[全局错误 · ${from}]`, error);
  showErrorToast(
    import.meta.env.DEV
      ? `页面出现异常：${error?.message || String(error)}`
      : "页面出现了一点小问题，请刷新重试",
  );
};

export const setupErrorHandler = (app) => {
  // 注意：设置 errorHandler 后 Vue 不再默认打印错误，此处需自行 console.error
  app.config.errorHandler = (err, _instance, info) => {
    handleError(err, `Vue · ${info}`);
  };

  window.addEventListener("error", (e) => {
    handleError(e.error || new Error(e.message), "window.error");
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    handleError(reason instanceof Error ? reason : new Error(String(reason)), "unhandledrejection");
  });
};
