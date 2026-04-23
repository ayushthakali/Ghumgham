import { api } from "../api";

export const destinationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query<any, any>({
      query: (params) => ({
        url: "/destinations",
        params,
      }),
    }),
  }),
});

export const { useGetDestinationsQuery } = destinationApi;
