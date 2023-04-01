const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const post = require("./models/post");

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("primeira_pagina");
});

app.post("/cadastrar", function (req, res) {
  post
    .create({
      nome: req.body.nome,
      cep: req.body.cep,
      endereco: req.body.endereco,
      cidade: req.body.cidade,
      estado: req.body.estado,
      bairro: req.body.bairro,
    })
    .then(function () {
      res.send("Cadastro realizado com sucesso!");
    })
    .catch(function (erro) {
      res.send("Falha ao cadastrar! " + erro);
    });
});

app.listen(8081, function () {});
