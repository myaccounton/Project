const express = require("express");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

const router = express.Router();

// Total revenue (completed rentals only)
router.get("/revenue", async (req, res) => {
  const result = await Rental.aggregate([
    { $match: { dateReturned: { $ne: null } } },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $ifNull: [
              "$totalCost",
              { $ifNull: ["$rentalFee", { $ifNull: ["$payment.amount", 0] }] },
            ],
          },
        },
      },
    },
  ]);

  res.send(result[0] || { totalRevenue: 0 });
});

// Total rentals
router.get("/count", async (req, res) => {
  const count = await Rental.countDocuments();
  res.send({ totalRentals: count });
});

// Dashboard comprehensive stats
router.get("/dashboard", async (req, res) => {
  const totalMovies = await Movie.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const activeRentals = await Rental.countDocuments({ dateReturned: null });
  const goldMembers = await Customer.countDocuments({ isGold: true });

  const mostRentedMovies = await Rental.aggregate([
    { $group: { _id: "$movie.title", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const moviesByGenre = await Movie.aggregate([
    { $group: { _id: "$genre.name", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  const recentRentals = await Rental.find()
    .sort("-dateOut")
    .limit(5)
    .select("customer.name movie.title dateOut");

  res.send({
    totalMovies,
    totalCustomers,
    activeRentals,
    goldMembers,
    mostRentedMovies,
    moviesByGenre,
    recentRentals
  });
});

module.exports = router;