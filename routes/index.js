var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

//连接数据库
mongoose.connect("mongodb://127.0.0.1:27017/news", (error) => {
  if (error) {
    throw error;
  }else {
    console.log("数据库已连接");
  }
})

//定义骨架
let listSchema = new mongoose.Schema({
  title: String,
  author: String,
  from: String,
  content: String,
  time: String,
  hits: Number                
});

//创建模型
let listModel = mongoose.model('list', listSchema, 'list');

/* GET home page. */
router.get('/', function(req, res, next) {
  listModel.find({}).exec((err, data) => {
    res.render('newslist', { list: data });
  });
});

//新增数据保存的路由
router.post('/save_add.html', (req, res) => {
  //接收数据
  let { title, author, from, content } = req.body;
  let list = new listModel();
  list.title = title;
  list.author = author;
  list.from = from;
  list.content = content;
  list.time = new Date().toLocaleString();
  list.hits = 1;
  list.save(() => {
    res.send("<h1>发布成功</h1>");
    console.log("新增成功！");
  });
})

//删除数据的路由
router.get('/del.html', (req, res) => {
  //接收数据
  let { id } = req.query;
  listModel.findById(id).exec((err, data) => {
    data.remove(() => {
      res.send('<script>alert("删除成功"); location.href="/";</script>')
    });
  })
})

//修改数据的路由
router.get('/modify.html', (req, res) => {
  //接收数据
  let { id } = req.query;
  listModel.findById(id).exec((err, data) => {
    res.render('modify', {
      news: data
    })
  })
})

//新增数据保存的路由
router.post('/save_edit.html', (req, res) => {
  //接收数据
  let id = req.query.id;
  let { title, author, from, content } = req.body;
  listModel.findById(id).exec((err, data) => {
    data.title = title;
    data.author = author;
    data.from = from;
    data.content = content;
    data.save(() => {
      res.send('<script>alert("修改成功"); location.href="/";</script>')
    });
  })
})

module.exports = router;
