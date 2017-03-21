const express = require('express');//引入express模块
const app = express();
const fs = require('fs');//引入文件模块
const formidable = require('formidable');//引入文件上传模块
app.set('port',process.env.PORT || 3888);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));//引入bodyParser获取表单支持
app.use(bodyParser.json());

const handlebars = require('express-handlebars').create({//引入handlebars模块
    "defaultLayout":"main",//设置默认布局为main
    //"layout":"vip",//不用设置其它布局，使用的使用直接用“layout":"xxx",xxx为其它布局名称即可
    "extname":".hbs"//设置模板引擎后缀为.hbs
});

app.engine('hbs',handlebars.engine);//将express模板引擎配置成handlebars,第一个参数是模板后缀
app.set('view engine','hbs');//第二个参数是模板后缀
app.set('views',__dirname + '/views');//第二个参数是模板目录

//引用express中间件
app.use(express.static(__dirname + '/public'));

app.get('/index',(req,res)=>{
    res.render('index/index',{"layout":"main"});//如果设置了默认模板则后面的可以不写
});

app.get('/product',(req,res)=>{
    res.render('index/product',{"layout":"main"});
});

app.get('/vip',(req,res)=>{
    res.render('index/vip',{"layout":"main"});//使用其它布局
});

app.get('/about',(req,res)=>{
    res.render('index/about',{"layout":"main"});
});

app.get('/news',(req,res)=>{
    res.render('index/news',{csrf:'CSRF token goes here'});
});

//获取表单内容
app.post('/process',(req,res)=>{
    console.log('Form (from querystring):' + req.query.form);
    console.log('CSRF token (from hidden form field):' + req.body._csrf);
    console.log('Name (from visible form field):' + req.body.name);
    console.log('Email (from visible form field):' + req.body.email);
    res.redirect(303,'/thank-you');
});

app.get('/photo',(req,res)=>{
    let now = new Date();
    res.render('index/photo',{
        "year":"now.getFullYear()",
        "month":"now.getMonth()"
    });
});
//上传文件
app.post('/contest/vacation-photo/:year/:moth',(req,res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        if(err){
            return;
            res.redirect(303,'/error');
        }else{
            console.log('received fields:');
            console.log(fields);
            console.log('received files:');
            console.log(files);
            fs.writeFile(__dirname+'/public/33.txt',files,(err)=>{
                if(err) throw err;
                console.log("File write success!");
            });
            res.redirect(303,'/thank-you');
        }
    });
});

app.listen(app.get('port'),()=>{
    console.log('server is running at http://localhost:3888/index');
});
