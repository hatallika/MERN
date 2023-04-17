import {body} from 'express-validator'

export const loginValidation = [
  body('email', 'Не верный формат почты').isEmail(),//если email корректный, то пропускаем
  body('password','Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const registerValidation = [
  body('email', 'Не верный формат почты').isEmail(),//если email корректный, то пропускаем
  body('password','Пароль должен быть минимум 5 символов').isLength({min: 5}),
  body('fullName','Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Не верная ссылка на аватарку').optional().isURL(),//необязательный, но если придет, проверим на ссылку.
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),//если email корректный, то пропускаем
  body('text','Введите текст статьи').isLength({min: 10}).isString(),
  body('tags','Не верный формат тегов').optional().isString(),
  body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const serviceCreateValidation = [
  body('name', 'Введите название услуги').isLength({min: 3}).isString(),//если email корректный, то пропускаем
  body('description','Введите краткое описание услуги').isLength({min: 5}).isString(),
  body('text','Введите информацию об услуге').isLength({min: 5}).isString(),
  body('tags','Не верный формат тегов').optional().isString(),
  body('rating','Введите число от 0 до 500').optional().isInt({min:0, max:500}),
  body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]