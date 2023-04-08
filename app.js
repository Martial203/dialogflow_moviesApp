'use strict';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const express = require('express');

const app = express();
app.use(express.json());

const API_KEY = "2623125ab4cda080556c25ecf71a5342";

const genres = {
    action: 28,
    aventure: 12,
    animation: 16,
    comedie: 35,
    crime: 80,
    documentaire: 99,
    drame: 18,
    familial: 10751,
    fantastique: 14,
    guerre: 10752,
    histoire: 36,
    horreur: 27,
    musique: 10402,
    mystere: 9648,
    romance: 10749,
    amour: 10749,
    science_fiction: 878,
    telefilm: 10770,
    thriller: 53,
    western: 37
};

app.post('/api/movies', (req, res, next) => {
    let category = req.body.queryResult.parameters.genre;
    const categ = category;
    console.log(category);
    category = genres[category];
    console.log(category);
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=fr&with_genres=${category}`)
        .then(data => data.json())
        .then(val => {
            console.log(val.results);
            const films = val.results.slice(0, 3);
            const cards = [{"text": {
              "text": [
                "Voici une liste de films que je vous propose, dans la catégorie "+categ
              ]
            }}];
            films.forEach(film => cards.push({
              "card": {
                "title": film.title,
                "imageUri": `https://image.tmdb.org/t/p/w500/${film.poster_path}`
              }},
              {
              "text": {"text": [`Date de sortie: ${film.release_date}\n Note: ${film.vote_average} Description: ${film.overview}`]}
            }));
            console.log(val.results);

            const result = {
                "fulfillmentMessages": cards
              };
            res.status(200).json(result);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({error});
        })
});

module.exports = app;