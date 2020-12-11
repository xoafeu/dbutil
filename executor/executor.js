function Executor(pool, logQueries=false) {
	this.pool = pool;
	this.logQueries = logQueries;
}

Executor.prototype.openConnection = openConnection;
Executor.prototype.closeConnection = closeConnection;
Executor.prototype.query = query;

function openConnection() {
	return new Promise((resolve, reject) => {
		this.pool.getConnection(function(err, connection){
			if (err) {
				reject(err);
			} else {
				resolve(connection);
			}
		});
	})
	.catch((error)=>{console.log("ERROR during connection", error)});
}

function query(connection, queryBuilder, keepConnection) {
	return new Promise((resolve, reject) =>{
		var sql = queryBuilder.sql();
        var args = queryBuilder.getArgs();

        if (this.logQueries) {
            console.log(sql, args, new Error("").stack);
        }
		
		connection.query(sql, args, (err, result)=>{
			if (!keepConnection) {
				this.pool.releaseConnection(connection);
			}
		    if (err) {
		    	reject(err);
		    } else {
		    	resolve(result);
		    }
		});
	})
	.catch((error)=>{
		console.log("ERROR during query", queryBuilder.sql(), queryBuilder.getArgs(), error); 
		this.pool.releaseConnection(connection);
		throw error;
	});
}

function closeConnection(connection) {
	return (result) => {
		Executor.pool.releaseConnection(connection);
		return result;
	}
}

module.exports = Executor;