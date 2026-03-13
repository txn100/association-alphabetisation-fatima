import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:9000/graphql', token: 'df0d4de26bb81e822baf560320e818282cff16e9', queries,  });
export default client;
  