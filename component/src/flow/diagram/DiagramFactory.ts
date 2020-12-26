import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Indicator, { IndicatorParams } from '@app/flow/diagram/common/Indicator';
import Link from '@app/flow/diagram/Link';
import Node from '@app/flow/diagram/Node';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import LinkParams from "@app/flow/diagram/LinkParams";


export default interface DiagramFactory {
  getAnchorPoint(point: CoordinatePoint): AnchorPoint;

  getLink(points: AnchorPoint[], params: LinkParams): Link;

  getIndicator(params: IndicatorParams): Indicator;

  getNode(nodeName: string, nodeParams: any): Node | any;
}
