/**
 * Created by barte_000 on 2016-10-23.
 */
var mongoose = require('mongoose');

var issueSchema = mongoose.Schema({
    title: {type: String, required: true},
    description:{type: String, default: ''},
    solveDate: {type: Date},
    links: {type: [String]}
}, {collection:'Issues'});

var Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;