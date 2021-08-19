const bson = require('bson')

module.exports.generateObjectId = () => new bson.ObjectID()

module.exports.toObjectId = (string) => new bson.ObjectID(string)
