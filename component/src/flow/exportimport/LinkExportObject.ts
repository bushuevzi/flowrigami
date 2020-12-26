import LinkParams from "@app/flow/diagram/LinkParams";

export default interface LinkExportObject {
  from: string;
  to: string;
  points: { x: number, y: number }[];
  // TODO здесь добавляем параметры для экспорта Переходов
  params: LinkParams;
}
