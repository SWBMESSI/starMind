import { nodes, edges } from '../core/store.js';
import { drawNode } from './nodeRenderer.js';
import { drawEdge } from './edgeRenderer.js';

export function render(ctx, scale, offsetX, offsetY, hoverNode) {
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);

    edges.forEach(edge => {
        const from = nodes.find(n => n.id===edge.from);
        const to = nodes.find(n => n.id===edge.to);
        if(from.folded) return;
        drawEdge(ctx, from, to, scale);
    });

    nodes.forEach(node => {
        drawNode(ctx, node, scale);
    });

    // 添加按钮
    if(hoverNode){
        const bx = hoverNode.x*scale + hoverNode.width*scale;
        const by = hoverNode.y*scale - 20*scale;
        ctx.fillStyle="#FF6347";
        ctx.fillRect(bx, by, 20*scale, 20*scale);
        ctx.fillStyle="#fff";
        ctx.font = `${16*scale}px sans-serif`;
        ctx.fillText("+", bx+5*scale, by+16*scale);
    }

    ctx.restore();
}
