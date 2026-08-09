import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getDashboardStats } from "../services/statsService";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        if (!cancelled) {
          setStats(data);
        }
      } catch (ex) {
        if (!cancelled) {
          toast.error("Failed to load dashboard stats");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !stats) {
    return (
      <div className="min-h-screen text-gray-100">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100">
      <div className="mb-8 flex flex-col gap-4 border-b border-gray-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Overview of store performance and rentals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <article className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Movies</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.totalMovies}</p>
        </article>

        <article className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Customers</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.totalCustomers}</p>
        </article>

        <article className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Rentals</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.activeRentals}</p>
        </article>
        
        <article className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg relative overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-500">Gold Members</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.goldMembers}</p>
        </article>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Most Rented Movies</h2>
          {stats.mostRentedMovies && stats.mostRentedMovies.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {stats.mostRentedMovies.map((movie, index) => (
                <li key={index} className="py-3 flex justify-between">
                  <span className="text-gray-300 font-medium">{movie._id}</span>
                  <span className="text-blue-400 font-bold">{movie.count} rentals</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No data available.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4">Movies by Genre</h2>
          {stats.moviesByGenre && stats.moviesByGenre.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {stats.moviesByGenre.map((genre, index) => (
                <li key={index} className="py-3 flex justify-between">
                  <span className="text-gray-300 font-medium">{genre._id}</span>
                  <span className="text-gray-400">{genre.count} movies</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No data available.</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4">Recent Rental Activity</h2>
        {stats.recentRentals && stats.recentRentals.length > 0 ? (
          <ul className="divide-y divide-gray-800">
            {stats.recentRentals.map((rental, index) => (
              <li key={index} className="py-3 flex justify-between">
                <div>
                  <span className="text-gray-300 font-medium">{rental.customer.name}</span>
                  <span className="text-gray-500 text-sm ml-2">rented {rental.movie.title}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(rental.dateOut).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
