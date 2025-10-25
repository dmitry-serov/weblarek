import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

// Интерфейс для состояния формы
interface IFormState {
  valid: boolean;
  errors: string[];
}

/**
 * Базовый класс для форм
 */
export abstract class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    // Обработка события отправки формы
    this.container.addEventListener('submit', (evt: Event) => {
      evt.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });

    // Обработка изменения любого поля ввода в форме
    this.container.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });
  }

  // Обработка изменения поля ввода
  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}:change`, {
      field,
      value
    });
  }

  // Установка валидности формы
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  // Установка ошибок формы
  set errors(value: string) {
    this._errors.textContent = value;
  }

  // Рендеринг состояния формы
  render(state: Partial<IFormState> & T): HTMLElement {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
