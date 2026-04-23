// src/pages/Home.tsx
import { useState } from "react";
import { useGetDestinationsQuery } from "../services/endpoints/destinationApi.endpoints";
import { useDebounce } from "../hooks/useDebounce";
import { useAddToTripMutation } from "../services/endpoints/tripApi.endpoints";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minCost, setMinCost] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 2000);

  const { data, isLoading } = useGetDestinationsQuery({
    search: debouncedSearch,
    category,
    minCost,
    page,
    limit: 5,
  });

  const [addToTrip] = useAddToTripMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Destinations</h1>

      <input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="budget">Budget</option>
        <option value="mid">Mid</option>
        <option value="luxury">Luxury</option>
      </select>

      <input
        placeholder="Min Cost"
        value={minCost}
        onChange={(e) => setMinCost(e.target.value)}
      />

      {data?.map((d: any) => (
        <div key={d.id}>
          <h3>{d.name}</h3>
          <p>{d.cost}</p>

          <button onClick={() => addToTrip({ destinationId: d.id, tripId: 1 })}>
            Add to Trip
          </button>
        </div>
      ))}

      <button onClick={() => setPage((p) => p - 1)}>Prev</button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
