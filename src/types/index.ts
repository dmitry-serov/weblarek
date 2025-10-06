export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс для товаров
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Тип способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс для покупателя
export interface IBuyerData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс заказа
export interface IOrder extends IBuyerData {
  total: number;
  items: string[];
}

// Интерфейс ответа сервера при запросе каталога
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Интерфейс ответа сервера после оформления заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Интерфейс объекта с ошибками валидации
export interface IValidationErrors {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
}

// Интерфейс для модели управления каталогом товаров
export interface IProductsModel {
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getProduct(id: string): IProduct | undefined;
  setPreview(product: IProduct): void;
  getPreview(): IProduct | null;
}

// Интерфейс для модели управления корзиной товаров
export interface ICartModel {
  getItems(): IProduct[];
  addItem(product: IProduct): void;
  removeItem(productId: string): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  contains(productId: string): boolean;
}


// Интерфейс для модели управления данными покупателя
export interface IBuyerModel {
  setData(data: Partial<IBuyerData>): void;
  getData(): IBuyerData;
  clear(): void;
  validate(): IValidationErrors;
}

// Интерфейс для взаимодействия с API интернет-магазина
export interface IWebLarekAPI {
  getProducts(): Promise<IProduct[]>;
  createOrder(order: IOrder): Promise<IOrderResult>;
}