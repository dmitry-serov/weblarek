import { IProduct, IProductsModel } from '../../types/index';

/**
 * Класс для управления каталогом товаров
 * Отвечает за хранение всех доступных товаров и товара для подробного просмотра
 */
export class ProductsModel implements IProductsModel {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  /**
   * Сохраняет массив товаров в каталоге
   * @param items - массив товаров для сохранения
   */
  setItems(items: IProduct[]): void {
    this._items = items;
  }

  /**
   * Возвращает массив всех товаров из каталога
   * @returns массив товаров
   */
  getItems(): IProduct[] {
    return this._items;
  }

  /**
   * Получает товар по его идентификатору
   * @param id - идентификатор товара
   * @returns найденный товар или undefined
   */
  getProduct(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  /**
   * Сохраняет товар для детального отображения
   * @param product - товар для предпросмотра
   */
  setPreview(product: IProduct): void {
    this._preview = product;
  }

  /**
   * Возвращает товар, выбранный для детального просмотра
   * @returns товар для предпросмотра или null
   */
  getPreview(): IProduct | null {
    return this._preview;
  }
}