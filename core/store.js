export let nodes = [{id:1,text:"根节点",x:0,y:0,width:120,height:50,children:[],folded:false,targetX:0,targetY:0}];
export let edges = [];
export let nodeId = 2;
export function getNextNodeId() {
    return nodeId++;
}

export function getNode(id) {
    return nodes.find(n => n.id === id);
}
