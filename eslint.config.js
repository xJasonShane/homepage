import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "auto-imports.d.ts", "components.d.ts"],
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // Vue SFC 编译宏
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        defineOptions: "readonly",
        defineModel: "readonly",
        withDefaults: "readonly",
        // unplugin-auto-import（vue preset）
        ref: "readonly",
        reactive: "readonly",
        computed: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        watchPostEffect: "readonly",
        watchSyncEffect: "readonly",
        toRef: "readonly",
        toRefs: "readonly",
        unref: "readonly",
        isRef: "readonly",
        h: "readonly",
        provide: "readonly",
        inject: "readonly",
        nextTick: "readonly",
        defineComponent: "readonly",
        defineAsyncComponent: "readonly",
        onBeforeMount: "readonly",
        onMounted: "readonly",
        onBeforeUnmount: "readonly",
        onUnmounted: "readonly",
        onActivated: "readonly",
        onDeactivated: "readonly",
        onErrorCaptured: "readonly",
        useAttrs: "readonly",
        useSlots: "readonly",
        // Element Plus 自动导入（ElMessage 等指令式 API）
        ElMessage: "readonly",
        ElMessageBox: "readonly",
        ElNotification: "readonly",
        ElLoading: "readonly",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
];
