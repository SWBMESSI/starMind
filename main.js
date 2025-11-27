import { nodes, edges } from './core/store.js';
import { computeSubtreeHeight, layoutTree } from './core/layout.js';
import { render } from './render/renderer.js';
import { initMouse } from './events/mouse.js';
import { initNodeEditor } from './events/editNode.js';

const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
const ctx = canvas.getContext('2d', { alpha: false });
const editor = document.getElementById("nodeEditor");

const dpr = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
ctx.scale(dpr,dpr);

// ---------- 初始状态 ----------
const state = {
    scale:0.6,
    offsetX:window.innerWidth/2,
    offsetY:100,
    dragNode:null,
    dragOffsetX:0,
    dragOffsetY:0,
    isPanning:false,
    panStartX:0,
    panStartY:0,
    panOffsetX:window.innerWidth/2,
    panOffsetY:100,
    hoverNode:null
};

// ---------- 初始化布局 ----------
computeSubtreeHeight(1);
layoutTree(1,100,100);

// ---------- 初始化事件 ----------
initMouse(canvas, ctx, state, editor);
initNodeEditor(canvas, editor, ctx, state);

// ---------- 渲染 ----------
render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);




let last = performance.now();
let frames = 0;

function fpsLoop() {
    frames++;
    const now = performance.now();

    if (now - last >= 1000) {
        const fps = frames;
        frames = 0;
        last = now;

        document.getElementById("fps").textContent = `FPS: ${fps}`;
    }

    requestAnimationFrame(fpsLoop);
}

fpsLoop(); // 启动 FPS 监控
