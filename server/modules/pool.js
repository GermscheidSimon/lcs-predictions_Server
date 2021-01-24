const pg = require('pg');
const url = require('url');

let config = {
    hsot: 'localhost',
    port: 5432,
    database: 'lcs_predictions',
    max: 20,
    idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);

pool.on('error', (err) => {
    console.log('pool has encout', err);
    process.exit(-1);
})

