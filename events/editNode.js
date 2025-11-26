import { findNodeAt } from '../core/hitTest.js';
import { computeSubtreeHeight, layoutTree } from '../core/layout.js';
import { render } from '../render/renderer.js';
import { nodes } from '../core/store.js';

export function initNodeEditor(canvas, editor, ctx, state){
    let editingNode = null;

    canvas.addEventListener("dblclick", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - state.offsetX)/state.scale;
        const y = (e.clientY - rect.top - state.offsetY)/state.scale;

        const node = findNodeAt(x, y);
        if(!node) return;

        editingNode = node;

        editor.style.display = "block";
        editor.value = node.text;
        editor.style.left = (node.x + 10 + state.offsetX) + "px";
        editor.style.top = (node.y + 10 + state.offsetY) + "px";
        editor.style.width = (node.width - 20) + "px";

        editor.focus();
        editor.select();
    });

    editor.addEventListener("blur", finishEdit);
    editor.addEventListener("keydown", (e) => {
        if(e.key==="Enter") editor.blur();
    });

    function finishEdit(){
        if(!editingNode) return;

        const newText = editor.value.trim();
        editingNode.text = newText;

        ctx.font = "16px sans-serif";
        const textWidth = ctx.measureText(newText).width;
        editingNode.width = Math.max(120, textWidth + 40);

        editor.style.display = "none";
        editingNode = null;

        computeSubtreeHeight(1);
        layoutTree(1,100,100);
        render(ctx, state.scale, state.offsetX, state.offsetY, state.hoverNode);
    }
}
