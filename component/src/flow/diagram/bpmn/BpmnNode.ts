import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import NodeExportObject from '@app/flow/exportimport/NodeExportObject';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Store from '@app/flow/store/Store';
import nanoid from 'nanoid';
import BpmnAnchorPoint from './BpmnAnchorPoint';
import Guid from '@app/flow/utils/TsUtils';


// @TODO temporarily kept only for bpmn (must replaced width NodeShape)
export default abstract class BpmnNode {
  public id: string;
  public name: string;
  public description: string;
  //TODO Добавить EditableProperties, которое является коллекцией EditableProperty[]
  public label = '';

  public coordinates: Coordinates;
  public points: BpmnAnchorPoint[] = [];

  public isHover = false;
  public isActive = false;
  public isEditing = false;

  constructor(coordinates: Coordinates) {
    this.id = Guid.newGuid();
    this.name = '';
    this.description = '';
    this.coordinates = coordinates;
  }

  public abstract draw(): void;

  public abstract drawPreview(): void;

  public renderHtml(parent: HTMLElement, store: Store) {};

  public export(): NodeExportObject {
    return {
      name: this.name,
      params: {
        id: this.id,
        label: this.label,

        name: this.name || '',
        description: this.description || '',
        //TODO Добавить EditableProperties, которое является коллекцией EditableProperty[]

        x: this.coordinates.x,
        y: this.coordinates.y
      },
    };
  };

  public abstract includes(coordinates: Coordinates): boolean;

  public abstract previewIncludes(coordinates: Coordinates): boolean;

  public move(x: number, y: number) {
    this.coordinates.move(x, y);
    this.points.forEach(point => point.move(x, y));
  }

  public getConnectionPoint(coordinates: CoordinatePoint) {
    return this.points.find(point => point.includes(coordinates));
  }
}
