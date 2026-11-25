import PropTypes from 'prop-types';
import React from 'react';
import {
  CreateListing,
  EditListing,
  Home,
  HostBookings,
  HostPastBookings,
  Listing,
  Listings,
  Login,
  PastTrips,
  Profile,
  Search,
  Trips,
  Wallet
} from './pages';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation
} from 'react-router-dom';
import {useUser} from './utils';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/create" element={<CreateListing />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/listing/:id/edit" element={<EditListing />} />
        <Route path="/listing/:id/bookings" element={<HostBookings />} />
        <Route
          path="/listing/:id/past-bookings"
          element={<HostPastBookings />}
        />
        <Route path="/trips" element={<Trips />} />
        <Route path="/past-trips" element={<PastTrips />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

// not currently used by any route, but handy for pages that require a logged-in user
export function PrivateRoute({children}) {
  const {user} = useUser();
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{from: location}} replace />
  );
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};
