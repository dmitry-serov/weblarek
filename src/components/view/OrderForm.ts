import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureAllElements } from '../../utils/utils';

interface IOrderForm {
  payment: string;
  address: string;
}

/**
 * Класс для первой формы заказа (способ оплаты и адрес)
 */
export class OrderForm extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    this._buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.payment = button.name;
        this.onInputChange('payment' as keyof IOrderForm, button.name);
      });
    });
  }

  set payment(name: string) {
    this._buttons.forEach(button => {
      button.classList.toggle('button_alt-active', button.name === name);
    });
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}
