import { Card } from './Card';
import { TCardCatalog } from '../../types/index';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

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

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    this._category.textContent = value;
    
    // Используем toggle для всех категорий
    for (const key in categoryMap) {
      this._category.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}
