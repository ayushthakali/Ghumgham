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

        async onQueryStarted(arg,{dispatch,queryFulfilled}){
            const patch = dispatch(
                api.util.
            )
        }
    },
    ),
  }),
});

export const { useGetTripsQuery, useCreateTripMutation, useAddToTripMutation } =
  tripApi;
