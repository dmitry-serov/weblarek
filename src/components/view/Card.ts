import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Интерфейс для карточки товара
interface ICard {
  title: string;
  price: number | null;
}

/**
 * Базовый класс для всех типов карточек товаров
 */
export abstract class Card<T extends ICard> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
  }

  // Установка заголовка карточки
  set title(value: string) {
    this._title.textContent = value;
  }

  // Установка цены карточки
  set price(value: number | null) {
    this._price.textContent = value === null 
      ? 'Бесценно' 
      : `${value} синапсов`;
  }
}
