import { getNode, nodes } from './store.js';

export function computeSubtreeHeight(nodeId) {
    const node = getNode(nodeId);
    if (!node.children || node.children.length===0) {
        node.subtreeHeight = node.height;
        return node.subtreeHeight;
    }
    let total = 0;
    node.children.forEach(cid => {
        total += computeSubtreeHeight(cid) + 40;
    });
    node.subtreeHeight = Math.max(node.height, total);
    return node.subtreeHeight;
}

export function layoutTree(nodeId, x, yTop) {
    const node = getNode(nodeId);

    // 当前节点放在子树中间
    node.x = x;
    node.y = yTop + node.subtreeHeight / 2 - node.height / 2;

    // 检查与已布局节点碰撞
    const minGap = 20;
    nodes.forEach(other => {
        if (other === node) return;
        if (node.x < other.x + other.width + minGap &&
            node.x + node.width + minGap > other.x &&
            node.y < other.y + other.height + minGap &&
            node.y + node.height + minGap > other.y) {
            // 有重叠 → 下移
            node.y = other.y + other.height + minGap;
        }
    });

    // 排子节点
    let currentY = node.y - node.subtreeHeight / 2 + node.height / 2;
    node.children.forEach(cid => {
        const child = getNode(cid);
        layoutTree(cid, x + 220, currentY);
        currentY += child.subtreeHeight + 40;
    });
}
