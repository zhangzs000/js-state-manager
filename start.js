var express=require("express");
var app=express();
var exStatic=require("express-static");
app.use(exStatic('./src'));//这一句中的'./'是静态页面的相对路径。
app.listen(8080);
console.log('server start !!!!')
