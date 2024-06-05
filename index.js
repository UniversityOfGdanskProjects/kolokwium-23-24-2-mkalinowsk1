const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const Customer = require('./models/customer');
const Movie = require('./models/movie');
const Rental = require('./models/rental');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/video_rental', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('Polaczono z baza');
}).catch((err) => {
    console.log('Blad polaczenia z baza: ', err);
});

app.get("/" , (req, res) => {
    res.send('Strona glowna');
});

app.get("/api/customers", async (req, res) => {
    try {
		const users = await Customer.find();
		res.json(users);
	}catch(err) {
		console.log(err);
		res.status(500).send('Internal Server Error');
	}
});
app.get("/api/movies/:id", async (req, res) => {
    try{
        const movieId = req.params.id;
        const movie = await Movie.findOne( {movie_id: movieId} );
        if(!movie){
            return res.status(404).send('Nie znaleziono filmu');
        }
        res.json(movie);
    }catch(err){
        console.log(err);
        res.status(500).send('Blad serwera');
    }
});

app.post("/api/rentals", async (req, res) => {
    const rental = new Rental({
        rental_id: req.body.rental_id,
        customer_id: req.body.customer_id,
        movie_id: req.body.movie_id,
        rental_date: req.body.rental_date,
        return_date: req.body.return_date,
        status: req.body.status
    });
    try{
        const newRental = await rental.save();
        res.json(newRental);
    }catch(err){
        console.log(err);
        res.status(500).send('Blad serwera');
    }
});

app.delete("/api/customers/:id", async (req, res) => {
    try{
        const customerId = req.params.id;
        const customer = await Customer.findOneAndDelete({customer_id: customerId});
        if(!customer){
            return res.status(404).send('Nie znaleziono klienta');
        }
        res.send('Klient usuniety');
    }catch(err){
        console.log(err);
        res.status(500).send('Blad serwera');
    
    }
});

app.get("/api/rentals/statistics", async (req, res) => {
    try {
        const totalRentals = await Rental.countDocuments();

        const rentalsByCustomer = await Rental.aggregate([
            { $group: { _id: "$customer_id", count: { $sum: 1 } } },
            { $group: { _id: null, average: { $avg: "$count" } } }
        ]);
        const averageRentalsPerCustomer = rentalsByCustomer[0]?.average || 0;

        const rentalsByCategory = await Rental.aggregate([
            { $lookup: { from: "movies", localField: "movie_id", foreignField: "movie_id", as: "movie" } },
            { $unwind: "$movie" },
            { $group: { _id: "$movie.genre", count: { $sum: 1 } } }
        ]);

        const rentalsByMonth = await Rental.aggregate([
            { $group: { _id: { $month: "$rental_date" }, count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            totalRentals,
            averageRentalsPerCustomer,
            rentalsByCategory,
            rentalsByMonth
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Błąd serwera');
    }
});

app.listen(3000, () => {
    console.log('Serwer dzialana porcie 3000');
});
