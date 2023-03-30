const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
console.log("ENV: ", ENV);

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
      }
    : {};

module.exports = new Pool(config);
