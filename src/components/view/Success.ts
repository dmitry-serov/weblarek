import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Интерфейс для окна успешного оформления заказа
interface ISuccess {
  total: number;
}

// Интерфейс для действий окна успешного оформления заказа
interface ISuccessActions {
  onClick: () => void;
}

/**
 * Класс для окна успешного оформления заказа
 */
export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

    // Привязка обработчика клика к кнопке закрытия окна
    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }

  // Установка общей стоимости заказа
  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}
