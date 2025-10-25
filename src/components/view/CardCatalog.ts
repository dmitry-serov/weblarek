import { Card } from './Card';
import { TCardCatalog } from '../../types/index';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

// Интерфейс для действий карточки
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

// Тип ключей категорий
type CategoryKey = keyof typeof categoryMap;

/**
 * Класс для карточки товара в каталоге
 */
export class CardCatalog extends Card<TCardCatalog> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container);

    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);

    // Привязка обработчика клика к контейнеру карточки
    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
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
}
