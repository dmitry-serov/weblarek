import { IBuyerData, TPayment, IBuyerModel } from '../../types/index';
import { IEvents } from '../base/Events';

/**
 * Класс для управления данными покупателя
 * Отвечает за хранение, обновление и валидацию данных покупателя
 */
export class BuyerModel implements IBuyerModel {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  constructor(protected events: IEvents) {}

  /**
   * Устанавливает данные покупателя
   * Позволяет обновить одно или несколько полей одновременно
   * @param data - объект с данными покупателя (могут быть переданы любые поля)
   */
  setData(data: Partial<IBuyerData>): void {
    if (data.payment !== undefined) {
      this._payment = data.payment;
    }
    if (data.address !== undefined) {
      this._address = data.address;
    }
    if (data.email !== undefined) {
      this._email = data.email;
    }
    if (data.phone !== undefined) {
      this._phone = data.phone;
    }

    this.events.emit('buyer:changed');
  }

  /**
   * Возвращает все данные покупателя
   * @returns объект с данными покупателя
   */
  getData(): IBuyerData {
    return {
      payment: this._payment as TPayment,
      address: this._address,
      email: this._email,
      phone: this._phone
    };
  }

  /**
   * Очищает все данные покупателя
   */
  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  /**
   * Выполняет валидацию данных покупателя
   * Можно указать шаг: 1 (оплата + адрес) или 2 (email + телефон)
   * @returns объект с ошибками валидации
   */
  validate(): Partial<Record<keyof IBuyerData, string>> {
    const errors: Partial<Record<keyof IBuyerData, string>> = {};

    if (!this._payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    
    if (!this._address.trim()) {
      errors.address = 'Введите адрес доставки';
    }

    if (!this._email.trim()) {
      errors.email = 'Введите адрес электронной почты';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Введите номер телефона';
    }

    return errors;
  }
}