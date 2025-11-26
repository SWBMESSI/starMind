export function drawEdge(ctx, from, to, scale) {
    const fx = from.x*scale + from.width*scale/2;
    const fy = from.y*scale + from.height*scale/2;
    const tx = to.x*scale + to.width*scale/2;
    const ty = to.y*scale + to.height*scale/2;
    const cx = (fx + tx)/2;

    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.bezierCurveTo(cx, fy, cx, ty, tx, ty);

    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 4*scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2*scale;

    const grad = ctx.createLinearGradient(fx, fy, tx, ty);
    grad.addColorStop(0, "#4A90E2");
    grad.addColorStop(1, "#50E3C2");
    ctx.strokeStyle = grad;

    ctx.lineWidth = 4*scale;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.shadowColor = "transparent";
}
