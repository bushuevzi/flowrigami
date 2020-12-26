import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export default interface LinkParams {
  id?: string;
  points?: CoordinatePoint[];

  // TODO здесь добавляем параметры для экспорта Переходов
  label?: string;
  name?: string;
  description?: string;
}

