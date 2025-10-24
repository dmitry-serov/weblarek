import { Component } from '../base/Component';

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

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
  
  render(data: IGallery): HTMLElement {
    this.catalog = data.catalog;
    return this.container;
  }
}
