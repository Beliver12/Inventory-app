const { Pool } = require("pg");

// The secret connection string you copied earlier
const connectionString =
'postgresql://postgres:jqRAlVaZRssGUpxYuMNztXDiMmQecreN@autorack.proxy.rlwy.net:21963/railway';

const pool = new Pool({
  connectionString,
});

module.exports = pool;