import { h } from "vue";
import { Error } from "@icon-park/vue-next";

/**
 * 统一错误提示
 * ElMessage + Error 图标的组合在多个组件中重复，收敛于此
 * @param {string} message 提示文本
 */
export const errorToast = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
};
