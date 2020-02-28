import Link from '@app/flow/diagram/Link';
import NodeShape from '@app/flow/diagram/NodeShape';
import Action from '@app/flow/store/history/Action';
import Store from '@app/flow/store/Store';


export default class DeleteNode implements Action {
  private store: Store;
  private node: NodeShape;
  private links: Link[] = [];

  constructor(store: Store, node: NodeShape, connections: Link[]) {
    this.store = store;
    this.node = node;
    this.links = connections;
  }

  execute = () => {
    this.store.nodeList = this.store.nodeList.filter(node => node.id !== this.node.id);
    this.store.connectorList = this.store.connectorList.filter((link) => {
      const detectedPoint = link.points.find(linePoint => {
        return this.node.points.find(point => point.id === linePoint.id);
      });

      return !detectedPoint;
    });
  };

  revert = () => {
    this.store.nodeList.push(this.node);
    this.store.connectorList = [...this.store.connectorList, ...this.links];
  };
}
