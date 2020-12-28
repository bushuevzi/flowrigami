import Context from '@app/flow/Context';
import Indicator from '@app/flow/diagram/common/Indicator';
import Node from '@app/flow/diagram/Node';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import { textareaChange } from '@app/flow/utils/HtmlUtils';
import { clickButton } from '@app/flow/utils/HtmlUtils';
import Link from "@app/flow/diagram/Link";
import 'bootstrap';


export default class PropertiesPanel {
  private store: Store;
  private propertiesPanel: HTMLElement;
  private propertiesPanelItems: HTMLElement;
  private propertiesPanelControl: HTMLElement;

  constructor(context: Context, propertiesPanel: HTMLElement) {
    this.store = context.store;

    this.propertiesPanel = propertiesPanel;
    this.propertiesPanelItems = propertiesPanel.querySelector('.fl-panel-items') as HTMLElement;
    this.propertiesPanelControl = this.propertiesPanel.querySelector('.fl-panel-toggler') as HTMLElement;
    this.propertiesPanelControl.onclick = this.handleToggle;

    this.store.subscribe(ACTION.SET_NODE, this.handleSetNode);
    this.store.subscribe(ACTION.ESCAPE, this.handleSetNode);
  }

  private handleToggle = () => {
    this.propertiesPanel.classList.toggle('active');
  };

  public handleSetNode = () => {
    this.hideProperties();
    const selectedShape = this.store.selectedNode || this.store.selectedConnector;
    if (selectedShape) {
      this.displayProperties(selectedShape);
    }
  };

  private displayProperties = (shape: Node | Link) => {
    const panelBodyDocumentFragment = document.createDocumentFragment();

    //TODO убрать с представления
    const idLabel = this.createPropertyLabelElement('ID');
    const idValue = this.createPropertyValueElement(shape.id);
    const shapeIdElement = this.createPropertyElement([idLabel, idValue]);

    const id = `${performance.now()}`;
    // Наименование
    const labelLabel = this.createPropertyLabelElement('Наименование', id);
    const labelTextarea = this.createPropertyTextareaElement(id, shape.label);
    labelTextarea.oninput = textareaChange((value) => {
      this.store.dispatch(ACTION.UPDATE_SHAPE_TEXT, { id: shape.id, text: value });
    });
    const shapeLabelElement = this.createPropertyElement([labelLabel, labelTextarea]);

    // Описание
    const descriptionLabel = this.createPropertyLabelElement('Описание', id);
    const descriptionTextarea = this.createPropertyTextareaElement(id, shape.description);
    descriptionTextarea.oninput = textareaChange((value) => {
      this.store.dispatch(ACTION.UPDATE_DESCRIPTION_TEXT, { id: shape.id, text: value });
    });
    const shapeDescriptionElement = this.createPropertyElement([descriptionLabel, descriptionTextarea]);

    // TODO здесь добавляем Свойства WorkflowSatus и Переходов, чтобы можно было бы их редактировать

    // Работа со свойствами только ПЕРЕХОДОВ
    if(shape instanceof Link){
      // Conditions
      const conditionsContainerLabel = this.createPropertyLabelElement('Условия выполнения перехода', id);
      const conditionsContainerElement = this.createPropertyElement([conditionsContainerLabel], "conditions");
      shape.conditions.forEach(condition => {
        // Поле выражения
        const conditionExpressionInput = this.createPropertyInputElement(condition.id, condition.expression);
        conditionExpressionInput.oninput = textareaChange((value) => {
          this.store.dispatch(ACTION.UPDATE_CONDITION_EXPRESSION_TEXT, { id: condition.id, text: value });
        });
        // Кнопка удаления
        const conditionDeleteButton = this.createDeleteButtonElement(id);
        conditionDeleteButton.onclick = clickButton(() => {
          this.store.dispatch(ACTION.DELETE_CONDITION, { id: condition.id });
          // Перерисовываем свойства после удаления условия
          conditionDeleteButton.parentElement?.remove();
          // let conditionElements = conditionsContainerElement?.childNodes;
          // conditionElements.forEach((currentValue, currentIndex, listObj)=>{
          //   for(let i = 0; i < currentValue.childNodes.length; i ++){
          //
          //   }
          // });
          // if(removedHTMLElement) conditionsContainerElement.removeChild(removedHTMLElement);
        });
        conditionsContainerElement.appendChild(this.createPropertyElement([conditionExpressionInput, conditionDeleteButton]))
      });

      panelBodyDocumentFragment.appendChild(conditionsContainerElement);
    }

    panelBodyDocumentFragment.appendChild(shapeIdElement);
    panelBodyDocumentFragment.appendChild(shapeLabelElement);
    panelBodyDocumentFragment.appendChild(shapeDescriptionElement);
    this.propertiesPanelItems.appendChild(panelBodyDocumentFragment);
  };

  private createPropertyLabelElement = (label: string, attrFor?: string) => {
    const span = document.createElement('span');
    span.classList.add('fl-prop-label');
    span.innerText = label;

    if (attrFor) {
      span.setAttribute('for', attrFor);
    }

    return span;
  };

  private createPropertyValueElement = (innerText: string) => {
    const span = document.createElement('span');
    span.classList.add('fl-prop-value');
    span.innerText = innerText;

    return span;
  };

  private createPropertyInputElement = (id: string, value: string) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.value = value;

    return input;
  };

  private createDeleteButtonElement = (id: string) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('btn');
    button.classList.add('btn-icon');
    button.classList.add('btn-sm');
    button.classList.add('btn-outline-danger');
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fa');
    trashIcon.classList.add('fa-trash-o');
    button.appendChild(trashIcon);

    return button;
  };

  private createPropertyTextareaElement = (id: string, value: string) => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('rows', '3');
    textarea.id = id;
    textarea.value = value;

    return textarea;
  };

  private createPropertyElement = (children: HTMLElement[], id?: string) => {
    const element = document.createElement('div');
    if(id) element.id = id;
    element.classList.add('fl-prop');
    children.forEach((it) => element.appendChild(it));

    return element;
  };

  private hideProperties = () => {
    const propertiesPanelItems = this.propertiesPanelItems;
    while (propertiesPanelItems.firstChild) {
      propertiesPanelItems.removeChild(propertiesPanelItems.firstChild);
    }
  };

  public unmount() {
    this.store.unsubscribe(ACTION.SET_NODE, this.handleSetNode);
  }
}
