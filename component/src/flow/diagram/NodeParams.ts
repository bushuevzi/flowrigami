export default interface NodeParams {
  id?: string;
  label?: string;
  x: number;
  y: number;

  //Свойства объекта WorkflowStatus
  // workflowStatusId?: number; // TODO нужен ли он
  name?: string;
  description?: string;
  //TODO Добавить EditableProperties, которое является коллекцией EditableProperty[]
}
