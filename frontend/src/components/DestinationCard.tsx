import type { DestinationDetail } from "../pages/Home";
import { useAddToTripMutation } from "../services/endpoints/tripApi.endpoints";

function DestinationCard({ destination }: { destination: DestinationDetail }) {
  const [addToTrip] = useAddToTripMutation();

  return (
    <div>
      <h3>{destination.name}</h3>
      <p>{destination.cost}</p>
      <img src={destination.image_url} alt={destination.name} width={200} />

      <button
        onClick={() => addToTrip({ destinationId: destination.id, tripId: 1 })}
      >
        Add to Trip
      </button>
    </div>
  );
}

export default DestinationCard;
