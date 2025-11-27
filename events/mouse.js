import { nodes, edges, getNextNodeId,nodeId } from '../core/store.js';
import { computeSubtreeHeight, layoutTree,placeNewNode} from '../core/layout.js';
import { render } from '../render/renderer.js';
import { animateNodes } from '../core/animation.js';

export function initMouse(canvas, ctx, state, editor) {
    const BUTTON_SIZE = 20;

    function getMousePos(e){
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - state.offsetX)/state.scale,
            y: (e.clientY - rect.top - state.offsetY)/state.scale
        };
    }


    function animationLoop() {
        const moving = animateNodes(nodes, 0.2);
        render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);

        if (moving) {
            requestAnimationFrame(animationLoop);
        }
    }

    canvas.addEventListener("mousemove",(e)=>{
        const pos = getMousePos(e);
        const {x, y} = pos;

        state.hoverNode = nodes.find(n =>
            x >= n.x-BUTTON_SIZE && x <= n.x+n.width+BUTTON_SIZE &&
            y >= n.y-BUTTON_SIZE && y <= n.y+n.height+BUTTON_SIZE
        );

        if(state.dragNode){
            state.dragNode.x = x - state.dragOffsetX;
            state.dragNode.y = y - state.dragOffsetY;
            state.dragNode.targetX = state.dragNode.x;
            state.dragNode.targetY = state.dragNode.y;
            render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
        } else if(state.isPanning){
            state.offsetX = state.panOffsetX + e.clientX - state.panStartX;
            state.offsetY = state.panOffsetY + e.clientY - state.panStartY;
            // state.dragNode.targetX = x - state.dragNode.x;
            // state.dragNode.targetY = y - state.dragNode.y;
            render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
        } else {
            render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
        }
    });

    canvas.addEventListener("mousedown",(e)=>{
        const pos = getMousePos(e);
        const {x, y} = pos;

        state.dragNode = nodes.find(n => x >= n.x && x <= n.x+n.width && y >= n.y && y <= n.y+n.height);

        if(state.dragNode){
            state.dragOffsetX = x - state.dragNode.x;
            state.dragOffsetY = y - state.dragNode.y;
            canvas.style.cursor="grabbing";
        } else {
            state.isPanning = true;
            state.panStartX = e.clientX;
            state.panStartY = e.clientY;
            state.panOffsetX = state.offsetX;
            state.panOffsetY = state.offsetY;
            canvas.style.cursor="grabbing";
        }
    });

    // canvas.addEventListener("mouseup",()=>{state.dragNode=null; state.isPanning=false; canvas.style.cursor="grab";});
    canvas.addEventListener("mouseup", ()=>{
        if(state.dragNode){
            // 放置节点 → 自动分开重叠
            // resolveCollisionEdge(state.dragNode);
        }
        state.dragNode = null;
        state.isPanning = false;
        canvas.style.cursor="grab";

        //   const overlap = (other.targetY + other.height) - node.targetY + gap;
        // node.targetY += overlap;
        // animationLoop();
        // render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
        // state.dragNode = null;
    });
    // 分离重叠的函数
    function resolveCollisionEdge(node, gap = 10) {
        if (!node) return;
        console.log(123)
        for (let other of nodes) {
            if (!other || other === node) continue;

            if (isColliding(node, other, 0)) {
                if (node.targetY > other.targetY) {
                    // A在B下方
                    const overlap = (other.targetY + other.height) - node.targetY + gap;
                    node.targetY += overlap;
                    other.targetY -= overlap;
                } else {
                    // A在B上方
                    const overlap = (node.targetY + node.height) - other.targetY + gap;
                    node.targetY -= overlap;
                    other.targetY += overlap;
                }

                // 递归处理多节点碰撞
                resolveCollisionEdge(other, gap);
            }
        }
    }

    function isColliding(a, b, padding = 0) {
        return !(
            a.targetX + a.width  < b.targetX - padding ||
            a.targetX > b.targetX + b.width + padding ||
            a.targetY + a.height < b.targetY - padding ||
            a.targetY > b.targetY + b.height + padding
        );
    }

    canvas.addEventListener("mouseleave",()=>{state.dragNode=null; state.isPanning=false; canvas.style.cursor="grab";});

    canvas.addEventListener("wheel",(e)=>{
        e.preventDefault();
        state.scale *= e.deltaY>0?0.9:1.1;
        if(state.scale<0.2) state.scale=0.2;
        if(state.scale>1.5) state.scale=1.5;
        render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
    },{passive:false});

    // 添加子节点
    canvas.addEventListener("click",(e)=>{
        if(!state.hoverNode) return;
        const pos = getMousePos(e);
        const {x, y} = pos;

        const bx = state.hoverNode.x + state.hoverNode.width;
        const by = state.hoverNode.y - BUTTON_SIZE;
        if(x>=bx && x<=bx+BUTTON_SIZE && y>=by && y<=by+BUTTON_SIZE){
            let id = getNextNodeId(); // 先存当前 id
            const newNode = {id:id, text:`节点${id}`, x:state.hoverNode.x, y:state.hoverNode.y+150, width:120, height:50, children:[], folded:false,targetX:state.hoverNode.x,targetY:state.hoverNode.y+150};
            nodes.push(newNode);
            edges.push({from:state.hoverNode.id,to:newNode.id});
            state.hoverNode.children.push(newNode.id);
            computeSubtreeHeight(1);
            // layoutTree(1,100,100);
            placeNewNode(newNode.id,state.hoverNode.id);
            render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
        }
    });
}
