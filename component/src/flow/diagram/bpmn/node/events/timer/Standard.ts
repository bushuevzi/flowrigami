import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import { innerFigureStyle, previewStyles, selectionStyle, styles } from '@app/flow/diagram/bpmn/node/events/eventsStyles/StandardConstants';
import Clock from '@app/flow/diagram/bpmn/shapes/Clock';
import Text from '@app/flow/diagram/bpmn/shapes/Text';
import CanvasCircle from '@app/flow/graphics/canvas/shapes/CanvasCircle';
import Store from '@app/flow/store/Store';
import BpmnAnchorPoint from '../../../BpmnAnchorPoint';
import BpmnNode from '../../../BpmnNode';


export default class Standard extends BpmnNode {
  name = 'Standard';

  private circle: CanvasCircle;
  private circlePreview: CanvasCircle;
  private circleSelection: CanvasCircle;

  private clock: Clock;
  private clockPreview: Clock;

  private textArea: Text;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, radius?: number) {
    super(coordinates);
    const shapeRadius = radius || 20;
    const activeRadius = shapeRadius + 3;

    const topCorner = new Coordinates(coordinates.x, coordinates.y - shapeRadius);
    const rightCorner = new Coordinates(coordinates.x + shapeRadius, coordinates.y);
    const bottomCorner = new Coordinates(coordinates.x, coordinates.y + shapeRadius);
    const leftCorner = new Coordinates(coordinates.x - shapeRadius, coordinates.y);

    this.points = [
      new BpmnAnchorPoint(ctx, leftCorner, BpmnAnchorPoint.Orientation.Left),
      new BpmnAnchorPoint(ctx, topCorner, BpmnAnchorPoint.Orientation.Top),
      new BpmnAnchorPoint(ctx, rightCorner, BpmnAnchorPoint.Orientation.Right),
      new BpmnAnchorPoint(ctx, bottomCorner, BpmnAnchorPoint.Orientation.Bottom)
    ];

    const circleParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: shapeRadius
    };

    const circlePreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: shapeRadius - 2
    };

    const circleSelectionParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: activeRadius
    };

    const clockParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: shapeRadius*0.7,
    };

    const clockPreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      radius: 13,
    };


    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');

    this.circle = new CanvasCircle(canvas, tmpHookDiv, styles, circleParams);
    this.circlePreview = new CanvasCircle(canvas, tmpHookDiv, previewStyles, circlePreviewParams);
    this.circleSelection = new CanvasCircle(canvas, tmpHookDiv, selectionStyle, circleSelectionParams);

    this.clock = new Clock(canvas, tmpHookDiv, innerFigureStyle, clockParams);
    this.clockPreview = new Clock(canvas, tmpHookDiv, innerFigureStyle, clockPreviewParams);

    this.textArea = new Text(ctx, new Coordinates(coordinates.x , coordinates.y + activeRadius + 2), shapeRadius, shapeRadius);
  }

  public draw() {
    this.textArea.text = this.label;

    this.circle.isActive = this.isActive;
    this.clock.isActive = this.isActive;
    this.textArea.isActive = this.isActive;

    this.circle.isHover = this.isHover;
    this.clock.isHover = this.isHover;

    this.circle.draw();
    this.clock.draw();

    if (this.isActive) {
      this.circleSelection.draw();
    }

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }

    if (!this.isEditing) {
      this.textArea.draw();
    }
  }

  public drawPreview() {
    this.circlePreview.isHover = this.isHover;
    this.clockPreview.isHover = this.isHover;

    this.circlePreview.draw();
    this.clockPreview.draw();
  }

  public previewIncludes(coordinates: Coordinates) {
    return this.circlePreview.includes(coordinates.x, coordinates.y);
  }


  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(coordinates: Coordinates) {
    const isInCircle = this.circle.includes(coordinates.x, coordinates.y);
    const isInConnectionPoint = !!this.getConnectionPoint(coordinates);
    const isTextAreaIncludes = this.textArea.includes(coordinates);

    return isInCircle || isInConnectionPoint || isTextAreaIncludes;
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textArea.renderHtml(parent, store, this.id, this.isEditing);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
    this.circle.move(dx, dy);
    this.circleSelection.move(dx, dy);
    this.clock.move(dx, dy);
    this.textArea.move(dx, dy);
    this.points.forEach(point => point.move(dx, dy));
  }
}
