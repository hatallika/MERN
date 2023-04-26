import {body} from 'express-validator'

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
  body('password','Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
  body('password','Пароль должен быть минимум 5 символов').isLength({min: 5}),
  body('fullName','Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),//необязательный, но если придет, проверим на ссылку.
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),//если email корректный, то пропускаем
  body('text','Введите текст статьи').isLength({min: 10}).isString(),

  body('tags','Неверный формат тегов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const serviceCreateValidation = [
  body('name', 'Введите название услуги').isLength({min: 3}).isString(),//если email корректный, то пропускаем
  body('description','Введите краткое описание услуги').isLength({min: 5}).isString(),
  body('text','Введите информацию об услуге').isLength({min: 5}).isString(),
  body('tags','Неверный формат тегов').optional().isString(),
  body('rating','Введите число от 0 до 500').optional().isInt({min:0, max:500}),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const catalogVideoCreateValidation = [
  body('name', 'Введите название каталога').isLength({min: 3}).isString(),
  body('description','Введите краткое описание каталога').isLength({min: 5}).isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
  body('category', 'Неверная название категории').isLength({min: 2}).isString(),
]

export const videoCreateValidation = [
  body('title', 'Введите заголовок видео').isLength({min: 3}).isString(),
  body('description','Введите описание видео').isLength({min: 5}).isString(),
  body('videoUrl', 'Неверная ссылка на видео').optional().isString(),
  body('category', 'Неверная название категории').isLength({min: 2}).isString(),
]

export const onlineRehabilitationValidation = [
  body('name', 'Введите название услуги').isLength({min: 3}).isString(),
  body('description','Введите описание услуги').isLength({min: 5}).isString(),
  body('treatment', 'Введите описание методы лечения').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
  body('tags','Не верный формат тегов').optional().isString(),
  body('rating','Введите число от 0 до 500').optional().isInt({min:0, max:500}),
  body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const customerCreateValidation = [
  body('firstName','Укажите имя').isLength({min: 3}),
  body('secondName','Укажите Фамилию').isLength({min: 3}),
  body('patronymic','Укажите Отчество').optional().isLength({min: 3}),
  body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
  body('phone', 'Неверный формат телефона').isInt(),
]

export const employerCreateValidation = [
  body('text', 'Введите описание достижений').isLength({min: 3}).isString(),
  body('description','Введите описание карточки врача').isLength({min: 3}).isString(),
  body('profession','Укажите профессию').isLength({min: 3}),
  body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
  body('certificates','Не верный формат документов').optional().isArray(),
]

export const appointmentCreateValidation = [
  body('dateTime','Выберите дату и время').isISO8601().toDate(),
]