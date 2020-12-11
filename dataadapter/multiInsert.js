var Query = require("./query");

//var MultiInsert = function(tablename, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9) {
var MultiInsert = function() {
    this.base = Query;
    this.base();

    var tablename = arguments[0];
    this.insert = "INSERT INTO " + tablename + " (";
    this.valueRow = '('
    this.numberOfColumns = 0;
    while (arguments.length > this.numberOfColumns+1) {
        if (this.numberOfColumns > 0) {
            this.insert += ', ';
            this.valueRow += ', ';
        }
        var column = arguments[this.numberOfColumns + 1];
        this.insert += "" + column + "";
        this.numberOfColumns++;
        this.valueRow += '$' + this.variableIndex++;
    }
    this.insert += ") VALUES ";
    this.valueRow += ')';
    this.values = ""; 
    
    this.add = function (v0, v1, v2, v3, v4, v5, v6, v7, v8, v9) {
        if (arguments.length != this.numberOfColumns) {
            throw "Invalid number of values:" + this.numberOfColumns + " " + JSON.stringify(arguments);
        }
        if (this.values.length > 0) {
            this.values += ', ';
        }
        this.values += this.valueRow;
        for (var i = 0; i<arguments.length; i++ ) {
            this.args.push(arguments[i]);
        }
        return this;
    };
    this.sql = function () {
        if (this.values.length > 0) {
            return this.insert + this.values;
        } else {
            return false;
        }
    };
};

module.exports = MultiInsert;