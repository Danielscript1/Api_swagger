import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config();

export default defineConfig({
  schema: "prisma/main/schema.prisma",
  migrations: {
    path: "prisma/main/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
