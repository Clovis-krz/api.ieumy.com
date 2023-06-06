const { Client } = require('pg')
require('dotenv').config();

/*const client = new Client({
  host: process.env.DB_HOST, 
  user:process.env.DB_USER, 
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})*/

client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports = {
    client,
}