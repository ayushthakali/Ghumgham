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

        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          const patch = dispatch(
            api.util.updateQueryData("getTrips", undefined, (draft: Trip[]) => {
              const trip = draft.find((t: Trip) => t.id === arg.tripId);
              if (trip) {
                trip.total_cost += 1000; // temp approximation
              }
            }),
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData(
            "getTripDetails",
            arg.tripId,
            (draft: any) => {
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
