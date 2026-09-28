import { isEqual } from "lodash-es";

let mainCursor;

const lerp = (a, b, n) => {
  if (Math.round(a) === b) {
    return b;
  }
  return (1 - n) * a + n * b;
};

class Cursor {
  constructor() {
    this.pos = {
      curr: null,
      prev: null,
    };
    this.handlers = {};
    this.create();
    this.init();
    this.render();
  }

  move(left, top) {
    this.cursor.style["left"] = `${left}px`;
    this.cursor.style["top"] = `${top}px`;
  }

  create() {
    if (!this.cursor) {
      this.cursor = document.createElement("div");
      this.cursor.id = "cursor";
      this.cursor.classList.add("xs-hidden", "hidden");
      document.body.append(this.cursor);
    }

    document.body.appendChild((this.scr = document.createElement("style")));
    this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='white' /></svg>") 4 4, auto !important}`;
  }

  // 仅响应鼠标指针事件，触屏 / 笔尖触发的 pointer 事件不会带动自定义光标
  isMouse(e) {
    return e.pointerType === "mouse";
  }

  init() {
    this.handlers = {
      move: (e) => {
        if (!this.isMouse(e)) return;
        this.pos.curr == null && this.move(e.clientX - 8, e.clientY - 8);
        this.pos.curr = {
          x: e.clientX - 8,
          y: e.clientY - 8,
        };
        this.cursor.classList.remove("hidden");
        this.render();
      },
      enter: (e) => this.isMouse(e) && this.cursor.classList.remove("hidden"),
      leave: (e) => this.isMouse(e) && this.cursor.classList.add("hidden"),
      down: (e) => this.isMouse(e) && this.cursor.classList.add("active"),
      up: (e) => this.isMouse(e) && this.cursor.classList.remove("active"),
    };
    // 使用 addEventListener 挂载：document.onXxx 属性赋值会被其他代码静默覆盖
    document.addEventListener("pointermove", this.handlers.move);
    document.addEventListener("pointerenter", this.handlers.enter);
    document.addEventListener("pointerleave", this.handlers.leave);
    document.addEventListener("pointerdown", this.handlers.down);
    document.addEventListener("pointerup", this.handlers.up);
  }

  destroy() {
    document.removeEventListener("pointermove", this.handlers.move);
    document.removeEventListener("pointerenter", this.handlers.enter);
    document.removeEventListener("pointerleave", this.handlers.leave);
    document.removeEventListener("pointerdown", this.handlers.down);
    document.removeEventListener("pointerup", this.handlers.up);
    this.handlers = {};
    this.scr?.remove();
    this.cursor?.remove();
    this.scr = null;
    this.cursor = null;
  }

  refresh() {
    this.destroy();
    this.pos = {
      curr: null,
      prev: null,
    };
    this.create();
    this.init();
    this.render();
  }

  render() {
    if (this.pos.prev) {
      this.pos.prev.x = lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
      this.pos.prev.y = lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
      this.move(this.pos.prev.x, this.pos.prev.y);
    } else {
      this.pos.prev = this.pos.curr;
    }
    if (!isEqual(this.pos.curr, this.pos.prev)) {
      requestAnimationFrame(() => this.render());
    }
  }
}

const cursorInit = () => {
  // 触屏 / 无精确指针设备不初始化：没有可跟随的光标，避免空转 rAF 渲染循环
  // 与注入全局 cursor 样式；用户系统开启"减弱动态效果"时同样跳过
  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches || reducedMotion.matches) {
    return null;
  }
  mainCursor = new Cursor();
  return mainCursor;
};

export default cursorInit;
