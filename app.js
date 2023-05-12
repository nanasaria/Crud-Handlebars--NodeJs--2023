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
      res.redirect("/consulta");
    })
    .catch(function (erro) {
      res.send("Falha ao cadastrar! " + erro);
    });
});

app.get("/consulta", function (req, res) {
  post
    .findAll()
    .then(function (post) {
      res.render("consulta", { post });
    })
    .catch(function (erro) {
      console.log("Erro ao carregar Dados!");
    });
});

app.get("/excluir/:id", function (req, res) {
  post
    .destroy({ where: { id: req.params.id } })
    .then(function () {
      alert("Excluído com Sucesso!");
      res.redirect("/consulta");
    })
    .catch(function (erro) {
      console.log("Erro ao excluir ou encontrar os dados do banco: " + erro);
    });
});

app.get("/editar/:id", function (req, res) {
  post
    .findAll({ where: { id: req.params.id } })
    .then(function (post) {
      res.render("editar", { post });
    })
    .catch(function (erro) {
      console.log("Erro ao carregar dados do banco: " + erro);
    });
});

app.post("/atualizar", function (req, res) {
  post
    .update(
      {
        nome: req.body.nome,
        cep: req.body.cep,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        estado: req.body.estado,
        bairro: req.body.bairro,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    )
    .then(function () {
      res.redirect("/consulta");
    });
});

app.listen(8080, function () {});
