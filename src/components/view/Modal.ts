import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IModalData {
  content: HTMLElement;
}

/**
 * Класс для управления модальным окном
 */
export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    
    container.addEventListener('click', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    });
    
    this._handleEscUp = this._handleEscUp.bind(this);
  }

  private _handleEscUp(evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  set content(value: HTMLElement | null) {
    if (value === null) {
      this._content.replaceChildren();
    } else {
      this._content.replaceChildren(value);
    }
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.addEventListener('keyup', this._handleEscUp);
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keyup', this._handleEscUp);
    this.content = null;
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
