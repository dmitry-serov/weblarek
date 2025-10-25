import './scss/styles.scss';
import { BuyerModel } from './components/models/BuyerModel';
import { ProductsModel } from './components/models/ProductsModel'
import { CartModel } from './components/models/CartModel';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './services/WebLarekAPI';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/view/Page';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { IOrder,IProduct } from './types/index';

// Создание глобального объекта событий
const events = new EventEmitter();

// Создание экземпляров классов
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);
const buyerModel = new BuyerModel(events);
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);

// Инициализация модального окна
const page = new Page(document.body, events);
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Сохранение шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация корзины
const basket = new Basket(cloneTemplate(basketTemplate), {
  onOrderClick: () => events.emit('order:start')
});

// Инициализация форм оформления заказа
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// ========================= СОБЫТИЯ ОТ МОДЕЛЕЙ =========================

// Изменился каталог - отрисовать карточки
events.on('catalog:changed', () => {
  const itemCards = productsModel.getItems().map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render({
      title: item.title,
      image: CDN_URL + item.image,
      category: item.category,
      price: item.price
    });
  });
  
  page.catalog = itemCards;
});

// Изменился выбранный товар - показать превью
events.on('preview:changed', () => {
  const item = productsModel.getPreview();
  if (item) {
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        if (cartModel.contains(item.id)) {
          cartModel.removeItem(item.id);
        } else {
          cartModel.addItem(item);
        }
        card.selected = cartModel.contains(item.id);
      }
    });
    
    modal.render({
      content: card.render({
        title: item.title,
        image: CDN_URL + item.image,
        category: item.category,
        price: item.price,
        description: item.description,
        selected: cartModel.contains(item.id)
      })
    });
  }
});

// Изменилась корзина - обновить счётчик и содержимое
events.on('cart:changed', () => {
  page.counter = cartModel.getCount();
  
  // Формирование списка товаров в корзине
  const items = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => cartModel.removeItem(item.id)
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1
    });
  });
  
  basket.render({
    items,
    total: cartModel.getTotal()
  });
});

// Изменились данные покупателя - обновить валидацию
events.on('buyer:changed', () => {
  const orderErrors = buyerModel.validate(1);
  const contactsErrors = buyerModel.validate(2);
  
  orderForm.valid = Object.keys(orderErrors).length === 0;
  orderForm.errors = Object.values(orderErrors).filter(i => !!i).join('; ');
  
  contactsForm.valid = Object.keys(contactsErrors).length === 0;
  contactsForm.errors = Object.values(contactsErrors).filter(i => !!i).join('; ');
});

//  ========================= СОБЫТИЯ ОТ VIEW =========================

// Выбрана карточка для просмотра
events.on('card:select', (item: IProduct) => {
  productsModel.setPreview(item);
});

// Открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
});

// Начать оформление заказа
events.on('order:start', () => {
  const data = buyerModel.getData();
  modal.render({
    content: orderForm.render({
      payment: data.payment || '',
      address: data.address || '',
      valid: false,
      errors: []
    })
  });
});

// Изменилась форма заказа
events.on('order:change', (data: { field: keyof IOrder; value: string }) => {
  buyerModel.setData({ [data.field]: data.value });
});

// Отправка формы заказа (переход к следующей форме)
events.on('order:submit', () => {
  const data = buyerModel.getData();
  modal.render({
    content: contactsForm.render({
      email: data.email || '',
      phone: data.phone || '',
      valid: false,
      errors: []
    })
  });
});

// Изменилась форма контактов
events.on('contacts:change', (data: { field: keyof IOrder; value: string }) => {
  buyerModel.setData({ [data.field]: data.value });
});

// Отправка формы контактов и создание заказа
events.on('contacts:submit', () => {
  const order: IOrder = {
    ...buyerModel.getData(),
    items: cartModel.getItems().map(item => item.id),
    total: cartModel.getTotal()
  };
  
  webLarekAPI.createOrder(order)
    .then((result) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close()
      });
      
      cartModel.clear();
      buyerModel.clear();
      
      modal.render({
        content: success.render({
          total: result.total
        })
      });
    })
    .catch(err => {
      console.error(err);
    });
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокировка прокрутки при закрытии модального окна
events.on('modal:close', () => {
  page.locked = false;
});

// Загрузка каталога товаров
webLarekAPI.getProducts()
  .then(products => productsModel.setItems(products))
  .catch(err => {
    console.error('Ошибка загрузки товаров:', err);
  });