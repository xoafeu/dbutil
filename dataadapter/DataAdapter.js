var QueryBuilder = require("./QueryBuilder");

function DataAdapter(tableName, idField='id') {
	this.tableName = tableName;
	this.idField = idField;
}

DataAdapter.prototype.insert = insert;
DataAdapter.prototype.multiInsert = multiInsert;
DataAdapter.prototype.update = update;
DataAdapter.prototype.deleteAll = deleteAll;
DataAdapter.prototype.del = del;
DataAdapter.prototype.findAll = findAll;
DataAdapter.prototype.countAll = countAll;
DataAdapter.prototype.findOne = findOne;
DataAdapter.prototype.returnFirstResult = returnFirstResult;
DataAdapter.prototype.convertDateToMySql = convertDateToMySql;
DataAdapter.prototype.convertTimeStampToMySql = convertTimeStampToMySql;

function countAll() {
	var queryBuilder = new QueryBuilder.Select(this.tableName);
	queryBuilder.getComplex("COUNT(DISTINCT telek.id) as count");
	return queryBuilder;
}

function findAll() {
	var queryBuilder = new QueryBuilder.Select(this.tableName);
	queryBuilder.get(this.idField, this.tableName);
	return queryBuilder;
}

function deleteAll() {
	var queryBuilder = new QueryBuilder.Delete(this.tableName);
	return queryBuilder;
}

function del(id) {
	var queryBuilder = this.deleteAll();
	queryBuilder.filter(this.idField, id);
	return queryBuilder;
}

function update(id) {
	var queryBuilder = new QueryBuilder.Update(this.tableName);
	queryBuilder.filter(this.idField, id);
	return queryBuilder;
}

function insert() {
	var queryBuilder = new QueryBuilder.Insert(this.tableName);
	return queryBuilder;
}

function multiInsert(...columns) {
	var queryBuilder = new QueryBuilder.MultiInsert(this.tableName, ...columns);
	return queryBuilder;
}

function findOne(id) {
	var queryBuilder = new QueryBuilder.Select(this.tableName);
	queryBuilder.get(this.idField, this.tableName);
	queryBuilder.filter(this.idField, id, this.tableName);
	return queryBuilder;
}

function returnFirstResult(results) {
	var result = undefined;
	
	if (results && results[0]) {
		result = results[0];
	}
	
	return Promise.resolve(result);
}

function convertDateToMySql(field) {
	if (!field) {
		return null;
	}
	return field.toISOString().slice(0,10);
}

function convertTimeStampToMySql(field) {
	if (!field) {
		return null;
	}
if (!field.toISOString) {
	try {
		throw new Error()	
	} catch(e) {
		console.log("error", field, e.stack)
	}

} 
	return field.toISOString().slice(0,19).replace('T', ' ');
}

module.exports = DataAdapter;