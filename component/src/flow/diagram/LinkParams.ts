import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Condition from "@app/flow/diagram/Condition";


export default interface LinkParams {
  id?: string;
  points?: CoordinatePoint[];

  // TODO здесь добавляем параметры для экспорта Переходов
  label?: string;
  name?: string;
  description?: string;
  conditions: Condition[];
}

