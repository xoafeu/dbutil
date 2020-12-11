var QueryBuilder = {
	Insert: require("./insert"),
	MultiInsert: require("./multiInsert"),
	Update: require("./update"),
	Delete: require("./delete"),
	ResetId: require("./resetId"),
	Select: require("./select"),
};

module.exports = QueryBuilder;