/**
 * 全局快捷键
 * 全站仅挂一个 window keydown 监听，按键 -> handler 注册表分发；
 * handler 返回 false 表示未消费当前按键，会继续传递给下一个同键 handler（用于 Esc 的弹层优先级）
 */
const handlers = new Map();

const isEditable = (el) =>
  el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

const dispatch = (e) => {
  // 修饰键组合（Ctrl/Cmd/Alt）留给浏览器与系统
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  // 忽略长按重复触发
  if (e.repeat) return;
  // 输入控件中不响应（Esc 除外）
  if (e.code !== "Escape" && isEditable(e.target)) return;
  const list = handlers.get(e.code);
  if (!list) return;
  e.preventDefault();
  for (const handler of list) {
    if (handler(e) !== false) break;
  }
};

export const registerShortcut = (code, handler) => {
  if (!handlers.has(code)) handlers.set(code, []);
  handlers.get(code).push(handler);
};

export const unregisterShortcut = (code, handler) => {
  const list = handlers.get(code);
  if (!list) return;
  const index = list.indexOf(handler);
  if (index !== -1) list.splice(index, 1);
};

export const initShortcuts = () => {
  window.addEventListener("keydown", dispatch);
};

export const destroyShortcuts = () => {
  window.removeEventListener("keydown", dispatch);
};
