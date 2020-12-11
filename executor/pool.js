var mysql = require('mysql');
var Pool = require('pg').Pool;

function initMysqlPool(config) {
	let pool = mysql.createPool({
		host: config.host,
		user: config.user,
		password: config.password,
		database: config.database,
		insecureAuth : true
	});
    console.log("mysql initialized", config.host, config.user, config.database, config.password.length);
    return pool;
}

function initPostGrePool(db) {
	const pool = new Pool(db)
	console.log("postgre initialized", db.host, db.port, db.database, db.user, db.password.length);
	return {
		getConnection: async (callback)=>{
			try {
				let client = await pool.connect();
				callback(null, {
					client,
					query: async function (sql, args, callback) {
						try {
							let result = await this.client.query(sql, args);
							callback(null, result.rows);
						} catch(error) {
							callback(error);
						}
					}
				});
			} catch (error) {
				callback(error);
			}
		},
		releaseConnection: (client)=> {
			try {
				client.client.release()
			} catch (error) {
				console.log(error)
			}
		}, 
	}
}

module.exports = {
	initPostGrePool,
	initMysqlPool
};