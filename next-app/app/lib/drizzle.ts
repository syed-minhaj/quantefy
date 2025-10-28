// src/db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../../db/schema";
import * as authSchema from "../../db/auth-schema";
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema : {...schema , ...authSchema}});
