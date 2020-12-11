var Query = require("./query");

var Insert = function(tablename) {
	this.base = Query;
	this.base();

	this.insert = "INSERT INTO " + tablename + " ("; 
	this.values = ""; 
	this.set = function (column, value, setnull) {
		if (value || value === false || value === 0 || value === "" || setnull) {
			if (this.values.length > 0) {
				this.insert += ", ";
				this.values += ", ";
			}
			if (value || value === 0 || value === false) {
				this.insert += "" + column + "";
				this.values += "$" + this.variableIndex++;
				this.args.push(value);
			} else if (value === "") {
				this.insert += "" + column + "";
				this.values += "''";
			} else {
				if (setnull) {
					this.insert += "" + column + "";
					this.values += "null";
				}
			}
		}
		return this;
	};
	this.sql = function () {
		if (this.values.length > 0) {
			//TODO RETURNING * is postgre specific
			return this.insert + ") VALUES (" + this.values + ") RETURNING *";
		} else {
			return false;
		}
	};
};

module.exports = Insert;