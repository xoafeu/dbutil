var Query = require("./query");

var Update = function(tablename, returnAll = true) {
	this.base = Query;
	this.base();
	
	this.update = "UPDATE " + tablename + " SET "; 
	this.set = function (column, value, setnull) {
		if (value !== undefined && value !== null) {
			if (this.first) {
				this.first = false;
			} else {
				this.update += ", ";
			}
			this.update += "" + column + " = $" + this.variableIndex++;
			this.args.push(value);
		} else {
			if (setnull) {
				if (this.first) {
					this.first = false;
				} else {
					this.update += ", ";
				}
				this.update += "" + column + " = null";
			}
		}
		return this;
	};
	this.sql = function () {
		let sql = this.conditions.length > 0
			? this.update + " WHERE 1=1" + this.conditions
			: this.update;

		if (returnAll) {
			sql += " RETURNING *";
		}

		return sql;
	};
};

module.exports = Update;