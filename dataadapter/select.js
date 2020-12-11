var Query = require("./query");
var formatSql = true;

var Select = function(tablename, alias) {
	this.base = Query;
	this.base();

	this.select = "SELECT "; 
	this.columns = ""; 
	this.from = (formatSql?"\n  ":" ") + "FROM " + tablename + "";
	if (alias) {
		this.from += " " + alias + "";
	}
	this.ordering = "";
	this.paging = "";
	this.get = function (column, tablename, alias) {
		if (this.columns.length > 0) {
			this.columns += "," + (formatSql?"\n    ":" ");
		}
		if (tablename) {
			this.columns += "" + tablename + ".";
		}
		this.columns += "" + column + "";

		if (alias) {
			this.columns += " as " + alias + "";
		}
		return this;
	};
	this.getComplex = function (expression) {
		if (this.columns.length > 0) {
			this.columns += "," + (formatSql?"\n    ":" ");
		}
		this.columns += expression;
		return this;
	};
	this.join = function (tablename, onCondition, alias, joinprefix) {
		alias = alias?alias:tablename;
		if (joinprefix) {
			this.from += " " + joinprefix;
		}
		this.from += (formatSql?"\n    ":" ") + "JOIN " + tablename + " " + alias + " ON " + onCondition;
		return this;
	};
	this.leftjoin = function (tablename, onCondition, alias) {
		this.join(tablename, onCondition, alias, " LEFT");
		return this;
	};
	this.limit = function (from, offset) {
		if ( !!from || from=== 0) {
			this.paging = (formatSql?"\n  ":" ") + "LIMIT " + from + (offset?" OFFSET " + offset:"");
		}
		return this;
	};
	this.orderBy = function (column, desc, tablename) {
		if (column) {
			if (this.ordering.length == 0) {
				this.ordering = "\n  ORDER BY ";
			} else {
				this.ordering += ", ";
			}
			if (tablename) {
				this.ordering += "" + tablename + ".";
			}
			this.ordering += "" + column + " " + (!!desc?"DESC":"ASC");
		}
		return this;
	};
	this.distinct = function () {
		this.distinct = true;
	};
	this.sql = function () {
		var sql = this.select 
			+ (this.distinct?" DISTINCT ":"")
			+ this.columns 
			+ this.from;
		if (this.conditions.length > 0) {
			sql += (formatSql?"\n  ":" ") + "WHERE 1=1" + this.conditions;
		}
		if (this.havings.length > 0) {
			sql += (formatSql?"\n  ":" ") + "HAVING " + this.havings;
		}
		if (this.ordering.length > 0) {
			sql += this.ordering;
		}
		if (this.paging.length > 0) {
			sql += this.paging;
		}
		return sql;
	};
};

module.exports = Select;