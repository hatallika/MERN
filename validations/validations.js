import {body} from 'express-validator'

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),//необязательный, но если придет, проверим на ссылку.
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),//если email корректный, то пропускаем
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),

    body('tags', 'Неверный формат тегов').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const serviceCreateValidation = [
    body('name', 'Введите название услуги').isLength({min: 3}).isString(),//если email корректный, то пропускаем
    body('description', 'Введите краткое описание услуги').isLength({min: 5}).isString(),
    body('text', 'Введите информацию об услуге').isLength({min: 5}).isString(),
    body('tags', 'Неверный формат тегов').optional().isString(),
    body('rating', 'Введите число от 0 до 500').optional().isInt({min: 0, max: 500}),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const catalogVideoCreateValidation = [
    body('name', 'Введите название каталога').isLength({min: 3}).isString(),
    body('description', 'Введите краткое описание каталога').isLength({min: 5}).isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('category', 'Неверная название категории').isLength({min: 2}).isString(),
]

export const videoCreateValidation = [
    body('title', 'Введите заголовок видео').isLength({min: 3}).isString(),
    body('description', 'Введите описание видео').isLength({min: 5}).isString(),
    body('videoUrl', 'Неверная ссылка на видео').optional().isString(),
    body('category', 'Неверная название категории').isLength({min: 2}).isString(),
]

export const onlineRehabilitationValidation = [
    body('name', 'Введите название услуги').isLength({min: 3}).isString(),
    body('description', 'Введите описание услуги').isLength({min: 5}).isString(),
    body('treatment', 'Введите описание методы лечения').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
    body('tags', 'Не верный формат тегов').optional().isString(),
    body('rating', 'Введите число от 0 до 500').optional().isInt({min: 0, max: 500}),
    body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
]

export const customerCreateValidation = [
    body('userId', 'Поле userId обязательно для заполнения').exists(),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('phone', 'Неверный формат телефона').isInt(),
    body('email', 'Неверный формат почты').isEmail(),//если email корректный, то пропускаем
    body('dateOfBirth', 'Неверный формат даты').isDate({ format: 'YYYY-MM-DD' }),
]

export const employerCreateValidation = [
    body('text', 'Введите описание достижений').isLength({min: 3}).isString(),
    body('description', 'Введите описание карточки врача').isLength({min: 3}).isString(),
    body('profession', 'Укажите профессию').isLength({min: 3}),
    body('imageUrl', 'Не верная ссылка на изображение').optional().isString(),//необязательный, но если придет, проверим на ссылку.
    body('certificates', 'Не верный формат документов').optional().isArray(),
]

export const appointmentCreateValidation = [
    // body('dateTime', 'Выберите дату и время').isISO8601().toDate(),
]

export const consultationRecordCreateValidation = [
    body('topic', 'Введите описание достижений').isLength({min: 3}).isString(),
    body('clientName', 'Введите описание карточки врача').isLength({min: 3}),
    body('clientEmail', 'Неверный формат почты').isEmail(),
    body('clientPhone', 'Неверный формат телефона').isInt(),
    body('additionalInfo', 'Не верный формат документов').isLength({min: 3}).isString(),
]

export const createPatientCardValidation = [
    body('userId', 'Поле userId обязательно для заполнения').exists(),
    body('catalogId', 'Недопустимый формат значения для catalogId').optional({nullable: true}).isMongoId(),
    body('employerId', 'Недопустимый формат значения для employerId').optional({nullable: true}).isMongoId(),
    body('recommendations', 'Значение recommendations должно быть строкой').optional({nullable: true}).isString()
];

export const createNewUserValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
    body('resetPasswordToken', 'Некорректный токен сброса пароля').optional().isString()
];

export const ScheduleCreateValidation = [
    body('daysOfWeek.*', 'Дни недели должны быть строками').isString(),
    body('schedules.*.startTime', 'Время начала должно быть в правильном формате').matches(/^([0-2][0-9]):([0-5][0-9])$/),
    body('schedules.*.endTime', 'Время окончания должно быть в правильном формате').matches(/^([0-2][0-9]):([0-5][0-9])$/),
    body('startRecur', 'Дата конца рекурсии должна быть в формате даты').optional().isISO8601(),
    body('endRecur', 'Дата конца рекурсии должна быть в формате даты').optional().isISO8601(),
    body('color', 'Цвет должен быть в формате HEX').optional().isHexColor(),
    body('groupId', 'Групповой ID не должен быть пустым').optional().notEmpty()
];
