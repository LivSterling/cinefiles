const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

// Middleware to protect the dashboard, this will push someone back to login of they arnt already
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

// Dashboard routes ===============================================================
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.user })
})

// movies routes ===============================================================

// GET(read) /movies - List all movies for the logged-in user 
router.get('/movies', isLoggedIn, async (req, res) => {
    try {
      const movies = await Movie.find({ userId: req.user._id })
      res.render('movies', { user: req.user, movies: movies })
    } catch (err) {
      console.log(err)
      res.redirect('/dashboard')
    }
  })

  router.post('/movies', isLoggedIn, async (req, res) => {//this Sets up a POST(Create). we making it aysc so we can set up an await bellow
    try { //were gonna use a try block so it runs. good data or bad
      const { title, status, director, year, rating, review } = req.body //pulling all at the same time instead of one by one/saves time and key strokes
  
      await Movie.create({// create a new log in mongdb. were making it await so it...... awaits untilll its done
        userId: req.user._id,
        title,
        status,
        director,
        year,
        rating,
        review,
      })
  
      res.redirect('/movies')// refresh page
    } catch (err) {
      console.log(err)
      res.redirect('/movies')// bad thing happen
    }
  })

 // GET(read )/movies/:id - View a single movie's details
router.get('/movies/:id', isLoggedIn, async (req, res) => {
    try {//were gonna use a try block so it runs. good data or bad
      const movie = await Movie.findOne({ 
        _id: req.params.id, //pilling the id part
        userId: req.user._id 
      })// looking for a movie by an id then we'll check if belongs to the current user
  
      if (!movie) {
        return res.redirect('/movies') // if no matching movie go back
      }
  
      res.render('moviedetails', { user: req.user, movie: movie })// if match it renders a new movie page
    } catch (err) {
      console.log(err)
      res.redirect('/movies')// bad thing happen again
    }
  })

  router.post('/movies/:id/update', isLoggedIn, async (req, res) => {
    try {
      const { title, status, director, year, rating, review } = req.body //pulling all at the same time instead of one by one/saves time and key strokes
  
      await Movie.findOneAndUpdate( //same as last time but now its updating a log
        { _id: req.params.id, userId: req.user._id },
        { title, status, director, year, rating, review }
      )
  
      res.status(200).json({ message: 'Movie updated' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error updating movie' })
    }
  })

  // POST /movies/:id/delete - Delete a movie
router.post('/movies/:id/delete', isLoggedIn, async (req, res) => { // had to use a POST here because I couldnt get the delete to play nice with the form
    try {
      await Movie.findOneAndDelete({ _id: req.params.id, userId: req.user._id }) //this double checks the Movie and user ID so somebody else Movie doesnt get deleted by mistake
      res.status(200).json({ message: 'Movie deleted' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error deleting movie' })
    }
  })

module.exports = router