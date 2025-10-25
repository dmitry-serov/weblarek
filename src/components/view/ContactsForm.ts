import { Form } from './Form';
import { IEvents } from '../base/Events';

interface IContactsForm {
  email: string;
  phone: string;
}

/**
 * Класс для второй формы заказа (email и телефон)
 */
export class ContactsForm extends Form<IContactsForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}
