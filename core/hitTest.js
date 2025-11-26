import { nodes } from './store.js';

export function findNodeAt(x, y) {
    return nodes.find(n => x >= n.x && x <= n.x + n.width &&
                           y >= n.y && y <= n.y + n.height);
}
