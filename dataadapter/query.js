var Query = function() {
	this.conditions = ""; 
	this.havings = ""; 
	this.args = [];
	this.first = true;
	this.variableIndex = 1;

	this.getArgs = function() {
		return this.args;	
	}

	this.exclude = function (column, value, tablename) {
		this.conditions += " AND ";
		if (value || value === 0) {
			this.conditions += "(";
			if (tablename) {
				this.conditions += "" + tablename + ".";
			}
			this.conditions += "" + column + " != $" + this.variableIndex++;
			this.args.push(value);
			this.conditions += " OR ";
			if (tablename) {
				this.conditions += "" + tablename + ".";
			}
			this.conditions += "" + column + " IS NULL)";
		} else {
			if (tablename) {
				this.conditions += "" + tablename + ".";
			}
			this.conditions += "" + column + " is NOT null";
		}
		return this;
	};

	this.filter = function (column, value, tablename) {
		return this.filterOperation(column, value, tablename, "=");
	};
	this.filterGT = function (column, value, tablename) {
		return this.filterOperation(column, value, tablename, ">");
	};
	this.filterGTE = function (column, value, tablename) {
		return this.filterOperation(column, value, tablename, ">=");
	};
	this.filterLT = function (column, value, tablename) {
		return this.filterOperation(column, value, tablename, "<");
	};
	this.filterLTE = function (column, value, tablename) {
		return this.filterOperation(column, value, tablename, "<=");
	};
	this.filterOperation = function (column, value, tablename, operation) {
		this.conditions += " AND ";
		if (tablename) {
			this.conditions += "" + tablename + ".";
		}
		if (value || value === 0) {
			this.conditions += "" + column + " " + operation + " $" + this.variableIndex++;
			this.args.push(value);
		} else {
			this.conditions += "" + column + " is null";
		}
		return this;
	};
	this.filterLike = function (column, value, tablename, allowPre=true, allowPost=true) {
		this.conditions += " AND ";
		if (tablename) {
			this.conditions += "" + tablename + ".";
		}
		if (value || value === 0) {
			this.conditions += "" + column 
				+ " like CONCAT(" 
					+ (allowPre?"'%', ":"") 
					+"$" + this.variableIndex++
					+ (allowPost?", '%'":"") 
				+")";
			this.args.push(value);
		} else {
			this.conditions += "" + column + " is null";
		}
		return this;
	};
	this.filterComplex = function () {
		var params = Array.prototype.slice.call(arguments);
		var filter = params.shift();
		if (filter) {
			this.conditions += " AND ";
			this.conditions += filter;
			
			//adding paramters
			params.forEach((argument)=>{
				this.args.push(argument);
			});
		}
		return this;
	};
	this.filterIn = function (column, value, tablename) {
		this.conditions += " AND ";
		if (tablename) {
			this.conditions += "" + tablename + ".";
		}
		if (value) {
			this.conditions += "" + column + " IN (" + value.join(',') + ")";
		} else {
			this.conditions += "" + column + " is null";
		}
		return this;
	};

	this.filterNotIn = function (column, value, tablename) {
		if (!value) {
			return;
		}
		this.conditions += " AND ";
		if (tablename) {
			this.conditions += "" + tablename + ".";
		}
		this.conditions += "" + column + " NOT IN (" + value.join(',') + ")";
		return this;
	};
	
	this.having = function (column, value, tablename) {
		return this.havingOperation(column, value, tablename, "=");
	};
	this.havingGT = function (column, value, tablename) {
		return this.havingOperation(column, value, tablename, ">");
	};
	this.havingGTE = function (column, value, tablename) {
		return this.havingOperation(column, value, tablename, ">=");
	};
	this.havingLT = function (column, value, tablename) {
		return this.havingOperation(column, value, tablename, "<");
	};
	this.havingLTE = function (column, value, tablename) {
		return this.havingOperation(column, value, tablename, "<=");
	};
	this.havingOperation = function (column, value, tablename, operation) {
		if (this.havings.length > 0) {
			this.havings += " AND ";		
		}
		if (tablename) {
			this.havings += "" + tablename + ".";
		}
		if (value || value === 0) {
			this.havings += "" + column + " " + operation + " $" + this.variableIndex++;
			this.args.push(value);
		} else {
			this.havings += "" + column + " is null";
		}
		return this;
	};
	this.havingLike = function (column, value, tablename) {
		if (this.havings.length > 0) {
			this.havings += " AND ";		
		}
		if (tablename) {
			this.havings += "" + tablename + ".";
		}
		if (value || value === 0) {
			this.havings += "" + column + " like  CONCAT('%', $" + this.variableIndex++ + ", '%')";
			this.args.push(value);
		} else {
			this.havings += "" + column + " is null";
		}
		return this;
	};
};

module.exports = Query;