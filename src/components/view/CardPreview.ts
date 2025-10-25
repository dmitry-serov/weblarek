import { Card } from './Card';
import { TCardPreview } from '../../types/index';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

// Интерфейс для действий карточки
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

// Тип ключей категорий
type CategoryKey = keyof typeof categoryMap;

/**
 * Класс для детального просмотра товара в модальном окне
 */
export class CardPreview extends Card<TCardPreview> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);
    this._description = ensureElement<HTMLElement>('.card__text', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);

    // Привязка обработчика клика к кнопке покупки/удаления из корзины
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  // Установка изображения карточки
  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  // Установка категории карточки
  set category(value: string) {
    this._category.textContent = value;
    
    // Обновление классов категории
    for (const key in categoryMap) {
      this._category.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  // Установка описания товара
  set description(value: string) {
    this._description.textContent = value;
  }

  // Установка состояния кнопки (в корзине/не в корзине)
  set selected(value: boolean) {
    if (this._button.disabled) {
      return;
    }
    
    this._button.textContent = value ? 'Удалить из корзины' : 'Купить';
  }

  // Установка цены товара
  set price(value: number | null) {
    super.price = value;
    
    if (value === null) {
      this._button.disabled = true;
      this._button.textContent = 'Недоступно';
    }
  }
}
