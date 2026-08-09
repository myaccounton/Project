import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useWatchlist from "../hooks/useWatchlist";
import { getCurrentProfile } from "../services/userService";

const Profile = () => {
  const { user } = useAuth();
  const { count: watchlistCount } = useWatchlist();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data } = await getCurrentProfile();
          setProfile(data);
        } catch (ex) {}
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg mt-10 p-8 text-center bg-gray-900 rounded-2xl border border-gray-800">
        <h4 className="text-gray-100 font-bold">User not logged in</h4>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading profile...</div>;
  }

  const isGold = profile?.isGold || false;

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">My Profile</h2>

      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-emerald-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 mb-8">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-gray-900 bg-gray-800 text-3xl font-bold text-white shadow-xl z-10">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="pb-1 text-center sm:text-left">
              <h5 className="text-2xl font-bold text-white m-0">{profile?.name || user.name}</h5>
              <p className="text-sm text-gray-400 m-0 mt-1">{profile?.email || user.email || "Email not available"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-gray-800/50 p-4 border border-gray-700/50 flex justify-between items-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Role</span>
              <span className="rounded-lg bg-blue-600/20 px-3 py-1 text-sm font-bold text-blue-400 border border-blue-500/20">
                {user.isAdmin ? "Admin" : "User"}
              </span>
            </div>

            <div className="rounded-xl bg-gray-800/50 p-4 border border-gray-700/50 flex justify-between items-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Membership</span>
              {user.isAdmin ? (
                <span className="text-gray-300 font-medium">Admin Account</span>
              ) : isGold ? (
                <span className="rounded-lg bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center gap-2">
                  <i className="fas fa-star text-xs"></i> Gold Member
                </span>
              ) : (
                <span className="rounded-lg bg-gray-700 px-3 py-1 text-sm font-medium text-gray-300 border border-gray-600">
                  Regular Member
                </span>
              )}
            </div>

            <div className="rounded-xl bg-gray-800/50 p-4 border border-gray-700/50 flex justify-between items-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Watchlist</span>
              <span className="rounded-lg bg-purple-500/20 px-3 py-1 text-sm font-bold text-purple-400 border border-purple-500/20">
                {watchlistCount} movies
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
