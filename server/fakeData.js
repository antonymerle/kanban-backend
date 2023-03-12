/*
---
Auteur: Antony Merle
Date: 2022-11-05
---
*/

const { v4: uuidv4 } = require("uuid");

//👇🏻 Nested object
let tasks = {
  pending: {
    category: "pending",
    items: [
      {
        id: uuidv4(),
        title: "Préparer la maquette finale du projet",
        comments: [
          {
            id: uuidv4(),
            name: "Pierre",
            text: "A faire d'ici vendredi",
          },
        ],
      },
    ],
  },
  ongoing: {
    category: "ongoing",
    items: [
      {
        id: uuidv4(),
        title: "Corriger le bug dans le formulaire",
        comments: [
          {
            name: "Paul",
            text: "Le formulaire renvoit un champ vide",
            id: uuidv4(),
          },
        ],
      },
    ],
  },
  completed: {
    category: "completed",
    items: [
      {
        id: uuidv4(),
        title: "Changer la couleur du bouton valider",
        comments: [
          {
            name: "Jacques",
            text: "Je préfère vert",
            id: uuidv4(),
          },
        ],
      },
    ],
  },
};

module.exports = { uuidv4, tasks };
