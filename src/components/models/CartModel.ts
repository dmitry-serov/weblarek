import { IProduct, ICartModel } from '../../types/index';

/**
 * Класс для управления корзиной покупок
 * Отвечает за хранение выбранных товаров, подсчёт стоимости и количества
 */
export class CartModel implements ICartModel {
  private _items: IProduct[] = [];

  /**
   * Возвращает массив товаров в корзине
   * @returns массив товаров
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Добавляет товар в корзину
   * Если товар уже есть в корзине, он не будет добавлен повторно
   * @param product - товар для добавления
   */
  addItem(product: IProduct): void {
    if (!this.contains(product.id)) {
      this._items.push(product);
    }
  }

  /**
   * Удаляет товар из корзины по его id
   * @param productId - id товара для удаления
   */
  removeItem(productId: string): void {
    this._items = this._items.filter(item => item.id !== productId);
  }

  /**
   * Очищает корзину, удаляя все товары
   */
  clear(): void {
    this._items = [];
  }

  /**
   * Вычисляет и возвращает общую стоимость товаров в корзине
   * Товары с price === null не учитываются в расчёте
   * @returns общая стоимость
   */
  getTotal(): number {
    return this._items.reduce((sum, item) => {
      return sum + (item.price || 0);
    }, 0);
  }

  /**
   * Возвращает количество товаров в корзине
   * @returns количество товаров
   */
  getCount(): number {
    return this._items.length;
  }

  /**
   * Проверяет наличие товара в корзине по его id
   * @param productId - идентификатор товара
   * @returns true если товар в корзине, иначе false
   */
  contains(productId: string): boolean {
    return this._items.some(item => item.id === productId);
  }
}