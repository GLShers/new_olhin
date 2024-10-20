import db from  '../../db/db.js';

class Register {

    async CreateUser(req) {
        
        
        try {
          const query = `INSERT INTO users(data, email, password) VALUES ($1, $2, $3) RETURNING *`;
          const values = [req.body.data, req.body.email, req.body.password]
          const result = await db.query(query,values);

          const id_user = result[0]
          const values_two=[id_user.id]
          const query_two= `INSERT INTO only_user (hero,user_id) VALUES (1,$1) RETURNING *`;
          const result_two = await db.query(query_two, values_two)
          
          return values_two
        } catch (error) {
          console.error();
          return null;
        }
    }
   

    async Sign_in_User(req,res) {
      try {
        console.log('Начало выполнения запроса');
        
        const query = `SELECT * FROM users WHERE email = $1 `;
        const values = [req.body.email];
        const  result = await db.query(query,values);
        const ress  = result[0];
        if (!ress) {
          return { success: false, message: 'Пользователь не найден' };
        }
        
        if (ress.password === req.body.password) {
          return { success: true, message: 'Пользователь найден' };
        } else {
          return { success: false, message: 'Неверный пароль' };
        }
        

        console.log(ress.id);
        console.log(req.body.email);
      }
       catch (error) {
      console.error('Ошибка в запросе к базе данных:', error);
      return null;
    }
  }



    async ChoiceHero(req) {
      try {
        const query = `UPDATE public.only_user SET hero = $1 WHERE user_id = $2;`;
        const values = [req.body.heroId, req.session.userId[0]];
        console.log(values)
        const result = await db.query(query, values);
        return result;
      } catch (error) {
        console.error('Ошибка в запросе к базе данных:', error);
        return null;
      }
    }
    

}

export default Register;