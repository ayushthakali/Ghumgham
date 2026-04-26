import type { Trip } from "../../pages/Trips";
import { api } from "../api";

export const tripApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<any, void>({
      query: () => "/trips",
      providesTags: ["Trips"],
    }),

    createTrip: builder.mutation<any, void>({
      query: () => ({
        url: "/trips",
        method: "POST",
      }),
      invalidatesTags: ["Trips"],
    }),

    addToTrip: builder.mutation<any, { destinationId: number; tripId: number }>(
      {
        query: (body) => ({
          url: "/trips/add",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Trips"],

        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          const patch = dispatch(
            tripApi.util.updateQueryData(
              "getTrips",
              undefined,
              (draft: Trip[]) => {
                const trip = draft.find((t: Trip) => t.id === arg.tripId);
                if (trip) {
                  trip.total_cost += 1000; // temp approximation
                }
              },
            ),
          );

          try {
            await queryFulfilled;
          } catch {
            patch.undo();
          }
        },
      },
    ),

    getTripDetails: builder.query<any, number>({
      query: (id) => `/trips/${id}`,
      providesTags: ["TripDetails"],
    }),

    removeFromTrip: builder.mutation<
      any,
      { destinationId: number; tripId: number }
    >({
      query: (body) => ({
        url: "/trips/remove",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Trips", "TripDetails"],

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          tripApi.util.updateQueryData(
            //api.util doesn't know endpoint "getTripDetails" so use extended API instance not base api
            "getTripDetails", //endpointName
            arg.tripId, //cacheKey
            (draft: any) => {
              //  immer draft — mutate directly : update the cache before the server responds
              return draft.filter((d: any) => d.id !== arg.destinationId);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTripsQuery,
  useCreateTripMutation,
  useAddToTripMutation,
  useGetTripDetailsQuery,
  useRemoveFromTripMutation,
} = tripApi;
