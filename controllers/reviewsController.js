const express = require('express')
const authenticate = require('./auth')
const reviews = express.Router({ mergeParams: true })
const { getAllReviews, getReview, createReview, deleteReview, updateReview } = require('../queries/reviews')



// INDEX
reviews.get('/', async (req, res) => {
    const { bookId } = req.params
    try {
        const allReviews = await getAllReviews(bookId)
        res.status(200).json(allReviews)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'})
    }
})


// SHOW
reviews.get('/:id', async (req, res) => {
    const { id } = req.params
    const review = await getReview(id)
    if(!review.message){
        res.status(200).json(review)
    } else {
        res.status(404).json({ error: "Not found" })
    }
})

// CREATE
reviews.post('/', authenticate, async (req, res) => {
    const { username } = req
    try {
        const review = await createReview({reviewer: username, ...req.body})
        res.status(200).json(review)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})


// DELETE
reviews.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const deletedReview = await deleteReview(id)
        res.status(200).json(deletedReview)
    } catch (error) {
        res.status(404).json({ error: "Id not found" })
    }
})


// UPDATE
reviews.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updatedReview = await updateReview(id, req.body)
        res.status(200).json(updatedReview)
    } catch (error) {
        res.status(404).json({ error: 'review not found!' })
    }
})


module.exports = reviews;