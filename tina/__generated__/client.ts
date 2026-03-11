import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'C:/Users/second/association-alphabetisation-fatima/.claude/worktrees/tina-migration/tina/__generated__/.cache/1773261783783', url: 'http://localhost:4001/graphql', token: 'df0d4de26bb81e822baf560320e818282cff16e9', queries,  });
export default client;
  