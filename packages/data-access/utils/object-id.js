const bson = require('bson')

module.exports.generateObjectId = () => new bson.ObjectId()

module.exports.toObjectId = (string) => new bson.ObjectId(string)
