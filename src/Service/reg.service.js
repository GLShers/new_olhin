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

        if (ress.password == req.body.password) {
          console.log('ehf')
          return ress.id;
        } else {
          return { success: false, message: 'Неверный пароль' };
        }

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


    
    async get_user_hero(req,res) {   //могу получить все данные пользователя из таблицы user_only
      try {
        console.log('Начало выполнения запроса');
        
        const query = `SELECT * FROM only_user WHERE user_id = $1 `;
        const values = req.session.userId;
        const  result = await db.query(query,values);
        const ress  = result[0];
        if (!ress) {
          return { success: false, message: 'Пользователь не найден' };
        }
        console.log(ress.hero)
        return ress
        
      }
       catch (error) {
      console.error('Ошибка в запросе к базе данных:', error);
      return null;
    }
    
    
  }

  async get_user_data(req,res) {    //могу получить все данные пользователя из таблицы users  так же вклю сюда get_data_allyans
    try {
      console.log('Начало выполнения запроса');
      
      const query = `SELECT * FROM users WHERE id = $1 `;
      const values = req.session.userId;
      const  result = await db.query(query,values);
      const ress  = result[0];
      return ress.data
      
    }
     catch (error) {
    console.error('Ошибка в запросе к базе данных:', error);
    return null;
    }
  }
async create_allyans(req,res) {            
  const { id, title } = req.body;
  const query = `INSERT INTO public.allyans (id,title) VALUES ($1,$2);`
  const values = [id,title];
  const  result = await db.query(query,values);
  const query_two=`UPDATE public.users SET allyans=$1 WHERE id=$2;`
  const values_two=[id,req.session.userId]
  const  result_two = await db.query(query_two,values_two);
  const ress  = result[0];
    

  }
  async get_data_allyans(req,res) {     //Извлекать данные из анльянса пользователя
    try {
      console.log('Начало выполнения запроса');
      
      const query = `SELECT * FROM users WHERE id = $1 `;
      const values = req.session.userId;
      const  result = await db.query(query,values);
      const ress  = result[0];
      console.log(ress.allyans) //для проверки
      const query_get_data_allayns=`SELECT id, lvl, armor, title FROM public.allyans WHERE id=$1;`
      const  values_get_data_allayns=[ress.allyans]

      const  result_data_allyans = await db.query(query_get_data_allayns, values_get_data_allayns);

      const ress_data_allyanss = result_data_allyans[0]
      console.log(ress_data_allyanss)
      return ress_data_allyanss
      
    }
     catch (error) {
    console.error('Ошибка в запросе к базе данных:', error);
    return null;
    }
  }
}
  
  



export default Register;