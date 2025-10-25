import { Component } from '../base/Component';

// Интерфейс для данных галереи
interface IGallery {
  catalog: HTMLElement[];
}

/**
 * Класс для управления галереей товаров
 */
export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  // Установка элементов каталога
  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
  
  // Рендеринг галереи
  render(data: IGallery): HTMLElement {
    this.catalog = data.catalog;
    return this.container;
  }
}
