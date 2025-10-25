import './scss/styles.scss';
import { BuyerModel } from './components/models/BuyerModel';
import { ProductsModel } from './components/models/ProductsModel'
import { CartModel } from './components/models/CartModel';
import { API_URL, CDN_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './services/WebLarekAPI';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { IProduct } from './types/index';


const events = new EventEmitter();

// Создание экземпляров классов
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);
const buyerModel = new BuyerModel();
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);


// Инициализация шапки сайта
const headerContainer = ensureElement<HTMLElement>('.header');
const header = new Header(events, headerContainer);

// Инициализация галереи товаров
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryContainer);

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

//
const basket = new Basket(cloneTemplate(basketTemplate), {
  onOrderClick: () => events.emit('order:start')
});

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
  
  gallery.render({
    catalog: itemCards
  });
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
  header.counter = cartModel.getCount();
  
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

// Выбрана карточка для просмотра
events.on('card:select', (item: IProduct) => {
  productsModel.setPreview(item);
});

// Блокировка прокрутки при открытии модального окна
events.on('modal:open', () => {
  const wrapper = ensureElement<HTMLElement>('.page__wrapper');
  wrapper.classList.add('page__wrapper_locked');
});

events.on('modal:close', () => {
  const wrapper = ensureElement<HTMLElement>('.page__wrapper');
  wrapper.classList.remove('page__wrapper_locked');
});

webLarekAPI.getProducts()
  .then(products => productsModel.setItems(products))
  .catch(err => {
    console.error('Ошибка загрузки товаров:', err);
  });