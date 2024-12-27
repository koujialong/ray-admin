import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      }
    },
  });

export const dehydrateQueries = (client) => {
  return client.dehydrate({
    dehydrateQueries: (query) =>
      defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    serializeData: SuperJSON.serialize,
  });
};

export const hydrateQueries = (client, dehydratedState) => {
  return client.hydrate(dehydratedState, {
    deserializeData: SuperJSON.deserialize,
  });
};
