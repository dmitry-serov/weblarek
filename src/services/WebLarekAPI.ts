import { IApi, IProduct, IProductsResponse, IOrder, IOrderResult, IWebLarekAPI } from '../types/index';

/**
 * Класс для взаимодействия с API сервера Web-ларёк
 * Использует базовый класс Api для выполнения HTTP-запросов
 */
export class WebLarekAPI implements IWebLarekAPI {
  private _api: IApi;

  /**
   * Создаёт экземпляр класса WebLarekAPI
   * @param api - экземпляр класса Api для выполнения запросов
   */
  constructor(api: IApi) {
    this._api = api;
  }

  /**
   * Получает список всех товаров с сервера
   * Выполняет GET-запрос на эндпоинт /product/
   * @returns Promise с массивом товаров
   */
  async getProducts(): Promise<IProduct[]> {
    const response = await this._api.get<IProductsResponse>('/product/');
    return response.items;
  }

  /**
   * Отправляет заказ на сервер
   * Выполняет POST-запрос на эндпоинт /order/
   * @param order - данные заказа для отправки
   * @returns Promise с результатом создания заказа
   */
  async createOrder(order: IOrder): Promise<IOrderResult> {
    return await this._api.post<IOrderResult>('/order/', order);
  }
}