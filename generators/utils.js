function uniqueArray(array) {
	return Array.from(new Set(array));
}

Set.prototype.minus = function(other) {
	return new Set([...this].filter(item => !other.has(item)));
};

Set.prototype.union = function(other) {
	return new Set([...this, ...other]);
};

Set.prototype.filter = function(predicate) {
	return new Set([...this].filter(predicate));
};

module.exports = {
	unique: uniqueArray,
	Set
};
