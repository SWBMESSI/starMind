import { roundRect } from './drawUtils.js';
export function drawNode(ctx, node, scale) {
    const nx = node.x * scale;
    const ny = node.y * scale;
    const nw = node.width * scale;
    const nh = node.height * scale;
    const radius = 10*scale;

    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 10*scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4*scale;

    roundRect(ctx, nx, ny, nw, nh, radius);
    ctx.fillStyle = "#ff9040ff";
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#000";
    ctx.font = `${16*scale}px sans-serif`;
    ctx.fillText(node.text, nx + 10*scale, ny + nh/2 + 6*scale);
}
