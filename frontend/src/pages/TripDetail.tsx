import { useParams } from "react-router-dom";
import {
  useGetTripDetailsQuery,
  useRemoveFromTripMutation,
} from "../services/endpoints/tripApi.endpoints";
import Loader from "../components/Loader";

export interface TripDetail {
  id: number;
  name: string;
  cost: number;
}

function TripDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetTripDetailsQuery(Number(id));
  const [removeFromTrip, { isLoading: removing }] = useRemoveFromTripMutation();

  if (isLoading) return <Loader />;

  return (
    <div>
      <h2>Trip #{id}</h2>

      {data?.map((d: TripDetail) => (
        <div key={d.id}>
          <h3>{d.name}</h3>
          <p>{d.cost}</p>
          <button
            disabled={removing}
            onClick={() =>
              removeFromTrip({ destinationId: d.id, tripId: Number(id) })
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default TripDetail;
