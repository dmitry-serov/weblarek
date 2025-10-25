import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';

// Интерфейс для представления корзины
interface IBasketView {
  items: HTMLElement[];
  total: number;
}

//
interface IBasketActions {
  onOrderClick: () => void;
}

/**
 * Класс для управления корзиной покупок
 */
export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // Привязка обработчика клика к кнопке оформления заказа
    if (actions?.onOrderClick) {
      this._button.addEventListener('click', actions.onOrderClick);
    }

    // Инициализация корзины как пустой
    this.items = [];
  }

  // Установка элементов корзины
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this._button.disabled = false;
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
      this._button.disabled = true;
    }
  }

  // Установка общей стоимости корзины
  set total(total: number) {
    this._total.textContent = `${total} синапсов`;
  }
}
