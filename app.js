const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { redirect } = require("express/lib/response");
const {initializeApp, applicationDefault, cert} = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('./crud-pwii-firebase-adminsdk-82nw0-fbeb3f1a93.json') 

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.render("primeira_pagina");
});

app.post("/cadastrar", function (req, res) {
  var result = db.collection('agendamentos').add({
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

app.get("/consulta", async function (req, res) {
  await db.collection('agendamentos').get().then((snapShot) => {
    const doc = [];
    snapShot.forEach((docs) => {
      doc.push({id: docs.id});
      doc.push(docs.data());
    })
    res.render("Consulta", {doc})
  }).catch((error) => {
    console.log(error)
  })
});

app.get("/excluir/:id", async function (req, res) {
  const id = req.params.id
  const doc = await db.collection('agendamentos').doc(`${id}`).delete().then(() => {
    res.redirect("/consulta")
  }).catch((error) => {
    console.log(error)
  })
});

app.get("/editar/:id", async function (req, res) {
  const id = req.params.id
  const doc = await db.collection('agendamentos').doc(`${id}`).get()
  const post = []

  try{
    post.push(id)
    post.push(doc.data())
    res.redirect("/editar", {post})
  }catch(error){
    console.log(error)
  }
});

app.post("/atualizar", async function (req, res) {
  await db.collection('agendamentos').doc(req.body.id).update({
        nome: req.body.nome,
        cep: req.body.cep,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        estado: req.body.estado,
        bairro: req.body.bairro,
      }).then(function () {
      res.redirect("/consulta");
    });
});

app.listen(8080, function () {});
