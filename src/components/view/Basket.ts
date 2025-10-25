import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

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

    if (actions?.onOrderClick) {
      this._button.addEventListener('click', actions.onOrderClick);
    }

    this.items = [];
  }

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

  set total(total: number) {
    this._total.textContent = `${total} синапсов`;
  }
}
