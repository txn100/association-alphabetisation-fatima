import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:9123/graphql', token: '', queries,  });
export default client;
  