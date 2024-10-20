import express from 'express';
import regRouter from './src/Controllers/reg.controller.js'; // Импортируйте только regRouter
import session from 'express-session';
import path  from 'path';
import { fileURLToPath } from 'url';
// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
// Получаем директорию, в которой находится текущий файл
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
app.use(session({
    secret: 'killa',  // Ключ для подписывания идентификатора сессии
    resave: false,  // Сессия не будет пересохранена, если не было изменений
    saveUninitialized: false,  // Не сохранять пустые сессии
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Устанавливаем время жизни куки на 1 день
    }
  }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.json());


app.use('/', regRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});