import { Router } from 'express';
import Register from '../Service/reg.service.js';

import path  from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const regService =new  Register();


router.get('/',async (req,res)=>{
    res.sendFile(path.join(__dirname,'..', '..', 'static', 'index.html'));

})//первая страница

router.get('/registry',async (req,res)=>{
    res.sendFile(path.join(__dirname,'..', '..', 'static', 'log_out.html'));

})//регистрация данные которой улетят на  сервер а точнее на /sign-up


router.get('/hero',async (req,res)=>{
    
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'my_hero.html'));
});


router.post('/sign-up',async (req, res) => {
    const user_id = await regService.CreateUser(req);
    req.session.userId = user_id;  // Сохраняем user_id в сессии
    console.log('User ID saved in session:', req.session.userId);
    res.redirect('/hero');
});//тут просто выполняется sql запрос , записывается пользователь в бд, и сохраняется id нового пользователя для его дальшнейшей регистрации

router.get('/home',async (req,res)=>{
  console.log('User ID from session:', req.session.userId);
  res.sendFile(path.join(__dirname,'..', '..', 'static', 'main.html'));

})
router.post('/choice_hero', async (req, res) => {
  try {
    const { heroId } = req.body;
    console.log(`Выбран персонаж с ID: ${heroId} для пользователя ${req.session.userId}`);

    await regService.ChoiceHero(req);

    // Принудительное сохранение сессии перед редиректом
    req.session.save(err => {
      if (err) {
        console.error('Ошибка при сохранении сессии:', err);
        return res.status(500).send('Ошибка при сохранении сессии');
      }
      res.redirect('/home');
    });
  } catch (error) {
    console.error('Ошибка при выборе персонажа:', error);
    res.status(500).send('Произошла ошибка');
  }
});

router.post('/sign-in', async (req, res) => {
  try {
   
    const sign_up_user_id=await regService.Sign_in_User(req)
    console.log(sign_up_user_id)
    if  (sign_up_user_id>0) {
      req.session.userId = sign_up_user_id; 
      res.redirect('/home')
    }

  } catch (error) {
    console.error('Ошибка при выборе персонажа:', error);
    res.status(500).send('Произошла ошибка');
  }
});


router.get('/api/get-user-id', (req, res) => {
  if (req.session.userId) {
      res.json({ userId: req.session.userId });
  } else {
      res.json({ userId: null });
  }
});
router.get('/api/get-user-hero', async (req, res) => {
  const hero = await regService.get_user_hero(req);
  if (hero) {
    res.json({ success: true, hero: hero });  // Отправляем JSON-ответ
  } else {
    res.json({ success: false, message: 'Ошибка получения героя' });
  }
});
router.get('/api/get-user-data', async (req, res) => {
  const data = await regService.get_user_data(req);
  if (data) {
    res.json({ success: true, dataa: data });  // Отправляем JSON-ответ
  } else {
    res.json({ success: false, message: 'Ошибка получения героя' });
  }
});

router.post('/create_allyans', async (req, res) => {
  await regService.create_allyans(req);
  
});


router.get('/get_data_allyans', async (req, res) => {
  const data = await regService.get_data_allyans(req);
  if (data) {
    res.json(data); // Отправляем ответ в формате JSON
  } else {
    res.status(500).json({ error: 'Ошибка получения данных альянса' });
  }
  
});

router.get('/join_allyans', async (req, res) => {
  await regService.join_allyans(req);
  
  
});






export default router; // Экспорт маршрутизатора