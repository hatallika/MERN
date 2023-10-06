import multer from 'multer';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const avatarStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        const dir = 'uploads/avatars';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });// создать, если отсутсвует
        }
        cb(null, dir);
    },
    filename: (_, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

const serviceImageStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        const dir = 'uploads/images/services';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (_, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

const trainingImageStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        const dir = 'uploads/images/training';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (_, file, cb) => {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
});

export const avatarUpload = multer({storage: avatarStorage});
export const serviceImageUpload = multer({storage: serviceImageStorage});
export const trainingImageUpload = multer({storage: trainingImageStorage});