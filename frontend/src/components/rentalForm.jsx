import React, { useEffect, useMemo, useState } from "react";
import Joi from "joi";
import { toast } from "react-toastify";
import useForm from "../hooks/useForm";
import useFetch from "../hooks/useFetch";
import useRentals from "../hooks/useRentals";
import queryString from "query-string";
import { getMovies } from "../services/movieService";
import { getCurrentProfile, upgradeToGold } from "../services/userService";
import PaymentModal from "./paymentModal";

const PAYMENT_DELAY_MS = 800;

const RentalForm = ({ history, location }) => {
  const schema = {
    movieId: Joi.string().required().label("Movie"),
  };

  const validateForm = (data) => {
    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(data, options);
    if (!error) return {};

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  const { data, renderSelect, renderButton, handleSubmit, setData } = useForm(
    {
      movieId: "",
    },
    validateForm
  );

  const { data: moviesData } = useFetch(async () => await getMovies(), []);
  const movies = Array.isArray(moviesData) ? moviesData : [];

  const { activeRentals, loading: rentalsLoading, createRental } = useRentals(true);

  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showGoldPayment, setShowGoldPayment] = useState(false);
  
  const [isGold, setIsGold] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: profile } = await getCurrentProfile();
        setIsGold(profile.isGold);
      } catch (ex) {
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const selectedMovie = useMemo(
    () => movies.find((m) => m._id === data.movieId),
    [movies, data.movieId]
  );

  const dailyRate = selectedMovie ? Number(selectedMovie.dailyRentalRate) : 0;

  useEffect(() => {
    const { movieId } = queryString.parse(location.search);
    if (movieId) {
      setData({ movieId });
    }
  }, [location.search, setData]);

  const handleUpgradePayment = async (paymentMethod) => {
    setUpgrading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      await upgradeToGold();
      setIsGold(true);
      toast.success("Payment successful! Welcome to Gold Membership 🌟");
      window.location.reload();
    } catch (ex) {
      toast.error("Failed to process payment.");
      setUpgrading(false);
      setShowGoldPayment(false);
    }
  };

  const limit = isGold ? 5 : 2;
  const isLimitReached = !rentalsLoading && !profileLoading && activeRentals.length >= limit;

  const doSubmit = () => {
    if (isLimitReached) {
      toast.error(`You have reached your rental limit of ${limit} movies.`);
      return;
    }
    setShowPayment(true);
  };

  const handleInitialPayment = async (paymentMethod) => {
    if (!data.movieId || !selectedMovie) return;

    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, PAYMENT_DELAY_MS));
      await createRental(data.movieId, {
        initialPayment: dailyRate,
        paymentStatus: "SUCCESS",
        paymentMethod,
      });
      setShowPayment(false);
      history.push("/my-rentals");
    } catch (ex) {
    } finally {
      setPaying(false);
    }
  };

  if (rentalsLoading || profileLoading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <h2 className="mb-6 text-3xl font-bold text-white">Rent Movie</h2>

        {isLimitReached ? (
          <div className="rounded-xl border border-red-900/50 bg-red-900/20 p-6 text-center">
            <div className="mb-3 text-4xl text-red-500">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3 className="mb-2 text-xl font-bold text-red-400">Rental Limit Reached</h3>
            <p className="mb-6 text-gray-300">
              You currently have <strong>{activeRentals.length} active rentals</strong>, which is the maximum for your account. Please return a movie before renting a new one.
            </p>
            
            {!isGold && (
              <div className="rounded-xl border border-yellow-700/50 bg-yellow-900/20 p-5">
                <h4 className="mb-2 font-bold text-yellow-400">Want to rent more?</h4>
                <p className="mb-4 text-sm text-gray-300">
                  Upgrade to Gold Membership to increase your active rental limit from 2 to 5 movies!
                </p>
                <button
                  onClick={() => setShowGoldPayment(true)}
                  disabled={upgrading}
                  className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 px-4 py-3 font-bold text-white shadow-lg transition hover:from-yellow-400 hover:to-amber-400 disabled:opacity-50"
                >
                  Upgrade to Gold Membership ⭐
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit(doSubmit)}>
            <div className="mb-6">
              {renderSelect("movieId", "Select Movie", movies, "_id", "title")}
            </div>
            {renderButton("Confirm Rental")}
          </form>
        )}

        {showPayment && selectedMovie && !isLimitReached && (
          <PaymentModal
            title="Pay to start rental"
            movieTitle={selectedMovie.title}
            dailyRate={dailyRate}
            subtitle="Initial charge covers your first day."
            amount={dailyRate}
            onPay={handleInitialPayment}
            onClose={() => !paying && setShowPayment(false)}
            disabled={paying}
          />
        )}

        {showGoldPayment && (
          <PaymentModal
            title="Gold Membership Upgrade"
            amount={499}
            subtitle="Unlock the ability to rent up to 5 movies simultaneously with a lifetime Gold Membership!"
            onPay={handleUpgradePayment}
            onClose={() => !upgrading && setShowGoldPayment(false)}
            disabled={upgrading}
          />
        )}
      </div>
    </div>
  );
};

export default RentalForm;
