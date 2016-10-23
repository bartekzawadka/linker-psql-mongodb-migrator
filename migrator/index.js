/**
 * Created by barte_000 on 2016-10-23.
 */
var sourceModels = require('../models/source');
var destIssue = require('../models/dest/issue');
var async = require('async');

module.exports.migrate = function(){

    sourceModels.issue.findAll({attributes:['id']}).then(function(res){
        var ids = [];
        for(var i in res){
            if(res.hasOwnProperty(i))
                ids.push(res[i].dataValues.id);
        }

        var succeededCount = 0;
        var failedCount = 0;
        var iterator = 0;

        async.map(ids, function(element, callback){
            sourceModels.issue.findById(element, {
                include:{model: sourceModels.link, attributes:['link']}
            }).then(function(item){

                var Issue = new destIssue({
                    title: item.dataValues.title,
                    description: item.dataValues.description,
                    solveDate: item.dataValues.solveDate,
                    links: item.links});
                Issue.save(function(err){
                    if(err) {
                        failedCount++;
                    }else{
                        succeededCount++;
                    }

                    iterator++;
                    var percentage = (iterator*100.0/(ids.length));
                    console.log(percentage+'%');
                    callback(err, null);
                });
            });
        }, function(err, result){
            if(err){
                console.log(err);
            }
            console.log('Migration finished.');
            console.log('Items migrated: '+succeededCount);
            console.log('Items failed: ' +failedCount);
        });

    });
};