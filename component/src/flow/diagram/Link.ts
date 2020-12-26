import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Shape from '@app/flow/graphics/Shape';
import Guid from '@app/flow/utils/TsUtils';
import Condition from "@app/flow/diagram/Condition";
import nanoid from 'nanoid';
import NodeParams from "@app/flow/diagram/NodeParams";
import LinkParams from "@app/flow/diagram/LinkParams";
import BpmnAnchorPoint from "@app/flow/diagram/bpmn/BpmnAnchorPoint";


export default abstract class Link implements Shape {
  public readonly id: string;

  // TODO здесь добавляем параметры для экспорта Переходов
  public label: string = '';
  public name: string = '';
  public description: string = '';
  public conditions: Condition[] = new Array();

  public points: AnchorPoint[];
  // @TODO check is this necessary
  public isOrthogonal = false;

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, points: AnchorPoint[], params: LinkParams) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.id = params.id || Guid.newGuid();
    this.points = points;

    this.label = params.label || '';
    this.name = params.name || '';
    this.description = params.description || '';
    this.conditions = params.conditions || new Array();
  }

  public abstract draw(): void;

  public abstract getDetectedPoint(coordinates: CoordinatePoint): AnchorPoint | undefined;

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;

  public abstract movePoint(point: AnchorPoint, dx: number, dy: number): void;

  public abstract movePointFinished(point: AnchorPoint): void;

  public abstract onHover(isHover: boolean): void;

  public getParams(): LinkParams {
    return {
      id: this.id,
      label: this.label,
      name: this.name,
      description: this.description,
      conditions: this.conditions
    };
  };
}
