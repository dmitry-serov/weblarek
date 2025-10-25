import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Header } from './Header';
import { Gallery } from './Gallery';

// Интерфейс для свойств страницы
interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

/**
 * Класс для управления общим лэйаутом страницы
 */
export class Page extends Component<IPage> {
  protected _wrapper: HTMLElement;
  protected _header: Header;
  protected _gallery: Gallery;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    
    // Инициализация шапки
    this._header = new Header(
      events, 
      ensureElement<HTMLElement>('.header')
    );
    
    // Инициализация галереи
    this._gallery = new Gallery(
      ensureElement<HTMLElement>('.gallery')
    );
  }

  // Установка счётчика товаров в шапке
  set counter(value: number) {
    this._header.counter = value;
  }

  // Установка каталога товаров в галерее
  set catalog(items: HTMLElement[]) {
    this._gallery.catalog = items;
  }

  // Блокировка прокрутки страницы
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}
