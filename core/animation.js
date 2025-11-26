export function animateNodes(nodes, delta = 0.2) {
    let moving = false;

    nodes.forEach(n => {
        const dx = n.targetX - n.x;
        if (Math.abs(dx) > 0.5) {
            n.x += dx * delta;
            moving = true;
        } else {
            n.x = n.targetX;
        }

        const dy = n.targetY - n.y;
        if (Math.abs(dy) > 0.5) {
            n.y += dy * delta;
            moving = true;
        } else {
            n.y = n.targetY;
        }
    });

    return moving;
}
