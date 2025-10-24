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


 const events = new EventEmitter();

// Создание экземпляров классов
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);
const buyerModel = new BuyerModel();
const productsModel = new ProductsModel(events);
const cartModel = new CartModel();


// Инициализация шапки сайта
const headerContainer = ensureElement<HTMLElement>('.header');
const header = new Header(events, headerContainer);

// Инициализация галереи товаров
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryContainer);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

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

webLarekAPI.getProducts()
  .then(products => productsModel.setItems(products))
  .catch(err => {
    console.error('Ошибка загрузки товаров:', err);
  });