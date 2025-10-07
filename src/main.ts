import './scss/styles.scss';
import { BuyerModel } from './components/models/BuyerModel';

//import { CartModel } from './components/models/CartModel';
//import { apiProducts } from './utils/data';

// Создание экземпляров классов
const buyerModel = new BuyerModel();
//const productsModel = new ProductsModel();
//const cartModel = new CartModel();

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