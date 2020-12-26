import Edge from '@app/graph/Edge';
import Guid from '@app/flow/utils/TsUtils';
import nanoid from 'nanoid';


export default class Vertex {
  id: string;
  edges: Edge[] = [];

  constructor() {
    this.id = Guid.newGuid();
  }

  public addEdge(edge: Edge) {
    this.edges = [...this.edges, edge];
  };

  public removeEdge(edge: Edge) {
    this.edges = this.edges.filter((it) => it.id !== edge.id);
  }

  public removeEdgeTo(vertex: Vertex) {
    this.edges = this.edges.filter((it) => !it.hasVertex(vertex));
  }
}
