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

export function placeNewNode(nodeId, parentId) {
    const parent = getNode(parentId);
    const node = getNode(nodeId);

    // 初始位置：父节点右侧
    let x = parent.x + 220;
    let y = parent.y;

    const minGap = 20;
    const stepY = 40;

    const isOverlap = (a, b) => (
        a.x < b.x + b.width + minGap &&
        a.x + a.width + minGap > b.x &&
        a.y < b.y + b.height + minGap &&
        a.y + a.height + minGap > b.y
    );

    // 所有其它节点，排除自己和父节点
    const others = nodes.filter(n => n.id !== nodeId && n.id !== parentId);

    let collided;
    do {
        collided = others.some(other =>
            isOverlap(
                { x, y, width: node.width, height: node.height },
                other
            )
        );

        if (collided) {
            y += stepY;  // 向下找空位
        }
    } while (collided);

    node.x = x;
    node.y = y;
}


