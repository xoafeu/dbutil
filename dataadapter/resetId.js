var Query = require("./query");

var ResetId = function(tablename) {
	this.base = Query;
	this.base();

	this.resetIdSQL = "ALTER TABLE " + tablename + " AUTO_INCREMENT = 1"; 
	this.sql = function () {
		return this.resetIdSQL;
	};
};

module.exports = ResetId;