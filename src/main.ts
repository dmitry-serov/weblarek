import './scss/styles.scss';
import { BuyerModel } from './components/models/BuyerModel';
import { ProductsModel } from './components/models/ProductsModel'
import { CartModel } from './components/models/CartModel';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { WebLarekAPI } from './services/WebLarekAPI';

// Создание экземпляров классов
const buyerModel = new BuyerModel();
const productsModel = new ProductsModel();
const cartModel = new CartModel();
const api = new Api(API_URL);
const webLarekAPI = new WebLarekAPI(api);

// ========================================
// Тестирование класса BuyerModel
// ========================================

console.log('--- Тестирование класса BuyerModel ---');

// Используем метод setData для установки нескольких полей
buyerModel.setData({
  address: 'ул. Ленина 128к1',
  email: 'test@test.ru'
});
console.log('Установлены address и email через setData');

// Используем метод setData для установки нескольких других полей
buyerModel.setData({
  payment: 'card',
  address: 'ул. Сиреневая 12',
  phone: '+79123456789'
});
console.log('Установлены payment, email, address и phone через setData');

// Получаем все данные
console.log('Получаем все данные покупателя:', buyerModel.getData());

// Очищаем данные
buyerModel.clear();
console.log('Все данные покупателя очищены');
console.log('Данные после очистки:', buyerModel.getData());

// Валидация с пустыми данными
console.log('Результат валидации с пустыми данными:', buyerModel.validate());

// Валидация первого шага заказа
buyerModel.setData({ payment: 'cash', address: 'ул. Мира 155' });
console.log('Результат валидации первого шага заказа (payment и address):', buyerModel.validate(1));

// Валидация второго шага заказа
buyerModel.setData({ email: 'mail@mail.ru', phone: '+79652587454' });
console.log('Результат валидации второго шага заказа (email и phone):', buyerModel.validate(2));

console.log('\n#################################\n\n');

// ========================================
// Тестирование класса ProductsModel
// ========================================
console.log('--- Тестирование класса ProductsModel ---');

// Сохраняем товары из тестовых данных
productsModel.setItems(apiProducts.items);
console.log('Товары сохранены в каталоге');

// Получаем все товары
const allProducts = productsModel.getItems();
console.log('Количество товаров в каталоге:', allProducts.length);
console.log('Массив товаров из каталога:', allProducts);

// Получаем товар по id
console.log('Товар, полученный по id:', productsModel.getProduct(allProducts[3].id));

// Устанавливаем товар для предпросмотра
productsModel.setPreview(allProducts[2]);
console.log('Товар для предпросмотра:', productsModel.getPreview());

console.log('\n#################################\n\n');

// ========================================
// Тестирование класса CartModel
// ========================================
console.log('--- Тестирование CartModel ---');

// Проверяем начальное состояние корзины
console.log('Начальное количество товаров в корзине:', cartModel.getCount());

// Добавляем товары в корзину
cartModel.addItem(allProducts[0]);
cartModel.addItem(allProducts[1]);
cartModel.addItem(allProducts[2]);
console.log('Добавлено 3 товара в корзину');

// Получаем товары из корзины
console.log('Количество товаров в корзине:', cartModel.getCount());
console.log('Товары в корзине:', cartModel.getItems());

// Проверяем общую стоимость
console.log('Общая стоимость товаров в корзине:', cartModel.getTotal(), 'синапсов');

// Проверяем наличие товара
console.log('Товар с id', allProducts[0].id, 'в корзине:', cartModel.contains(allProducts[0].id));

// Удаляем товар из корзины
cartModel.removeItem(allProducts[0].id);
console.log('Товар удалён из корзины. Осталось товаров:', cartModel.getCount());
console.log('Товары после удаления:', cartModel.getItems());

// Очищаем корзину
cartModel.clear();
console.log('Корзина очищена. Количество товаров:', cartModel.getCount());

console.log('\n#################################\n\n');

// ========================================
// Тестирование WebLarekAPI - запрос к серверу
// ========================================
console.log('--- Тестирование WebLarekAPI ---');
console.log('Выполняется запрос к серверу за каталогом товаров...\n');

// Запрос товаров с сервера
webLarekAPI.getProducts()
  .then(productsFromServer => {
    console.log('Товары успешно получены с сервера');
    console.log('Количество товаров с сервера:', productsFromServer.length);
    
    // Сохраняем полученные товары в модель каталога
    productsModel.setItems(productsFromServer);
    console.log('Товары сохранены в каталоге');
    
    // Получаем и выводим сохранённый каталог
    console.log('Товары из модели каталога:', productsModel.getItems());
    
    console.log('\n=== Тестирование завершено успешно ===');
  })
  .catch(error => {
    console.error('Ошибка при получении товаров:', error);
  });