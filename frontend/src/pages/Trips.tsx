import { Link } from "react-router-dom";
import {
  useCreateTripMutation,
  useGetTripsQuery,
} from "../services/endpoints/tripApi.endpoints";

export interface Trip {
  id: number;
  total_cost: number;
}

function Trips() {
  const { data, isLoading } = useGetTripsQuery();
  const [createTrip] = useCreateTripMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Trips</h2>
      <button onClick={() => createTrip()}>Create Trip</button>

      {data?.map((trip: Trip) => (
        <div>
          <p>Trip #{trip.id}</p>
          <p>Total cost: {trip.total_cost}</p>
          <Link to={`/trips/${trip.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default Trips;
