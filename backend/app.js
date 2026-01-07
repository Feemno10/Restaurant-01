const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3003 ;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(morgan('dev'));

app.use('public' , express.static(path.join(__dirname , 'public')));

app.use((req, res, next) => {
  const _json = res.json.bind(res);
  res.json = (data) => {
    const fixed = JSON.parse(JSON.stringify(data, (_k, v) =>
      typeof v === 'bigint' ? Number(v) : v
    ));
    return _json(fixed);
  };
  next();
});

app.get('/' , (req,res)=>{
    res.json ({ success : true , message : "API is Running "});
});

app.use('/auth' , require('./routers/authroutes'));
app.use('/admin' , require('./routers/adminrouters'));
app.use('/restaurant' , require('./routers/restaurantrouters'));
app.use('/category' , require('./routers/food_categoryroutes'))


app.listen(port , ()=>{
  console.log('Server Started at Port');
});