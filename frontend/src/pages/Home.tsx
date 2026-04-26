// src/pages/Home.tsx
import { useMemo, useState } from "react";
import { useGetDestinationsQuery } from "../services/endpoints/destinationApi.endpoints";
import { useDebounce } from "../hooks/useDebounce";
import Loader from "../components/Loader";
import DestinationCard from "../components/DestinationCard";

export interface DestinationDetail {
  id: number;
  name: string;
  cost: string;
  image_url: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minCost, setMinCost] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 800);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      category,
      minCost,
      page,
      limit: 5,
    }),
    [debouncedSearch, category, page, minCost],
  );

  const { data, isLoading, error } = useGetDestinationsQuery(queryParams);

  if (isLoading) return <Loader />;

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div>
      <h1>Destinations</h1>

      <input
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setPage(1);
        }}
      >
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

      {data?.map((d: DestinationDetail) => (
        <div key={d.id}>
          <DestinationCard destination={d} />
        </div>
      ))}

      <button
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Prev
      </button>
      <button onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
