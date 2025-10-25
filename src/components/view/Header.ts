import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

// Интерфейс для шапки сайта
interface IHeader {
  counter: number;
}

/**
 * Класс для управления шапкой сайта
 */
export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    
    // Обработка клика по кнопке корзины
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  // Установка количества товаров в корзине
  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
