var Query = require("./query");

var Delete = function(tablename) {
	this.base = Query;
	this.base();

	this.deleteSQL = "DELETE FROM " + tablename + ""; 
	this.sql = function () {
		if (this.conditions.length > 0) {
			return this.deleteSQL + " WHERE 1=1" + this.conditions;
		} else {
			return this.deleteSQL;
		}
	};
};

module.exports = Delete;