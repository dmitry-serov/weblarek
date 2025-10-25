import { Card } from './Card';
import { TCardBasket } from '../../types/index';
import { ensureElement } from '../../utils/utils';

// Интерфейс для действий карточки
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

/**
 * Класс для карточки товара в корзине
 */
export class CardBasket extends Card<TCardBasket> {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container);

    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    // Привязка обработчика клика к кнопке удаления из корзины
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  // Установка позиции товара в корзине
  set index(value: number) {
    this._index.textContent = String(value);
  }
}
