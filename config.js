console.log(process.env.DATABASE_URL);
module.exports = {
  PORT: process.env.PORT || 8080,
  DATABASE_URL: process.env.DATABASE_URL || 'http://localhost:3000',
  JWT_SECRET: 'But Why Male Models?',
  JWT_EXPIRY: '1d',
}