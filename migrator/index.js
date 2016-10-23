/**
 * Created by barte_000 on 2016-10-23.
 */
var sourceModels = require('../models/source');
var destIssue = require('../models/dest/issue');
var destUser = require('../models/dest/user');
var async = require('async');

module.exports.migrateIssues = function(finishedCallback){

    console.log('[ISSUES] - Migration started.');
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

                var links = null;
                if(item.links && item.links.length > 0){
                    links = [];
                    for(var k in item.links){
                        links.push(item.links[k].dataValues.link);
                    }
                }

                var Issue = new destIssue({
                    title: item.dataValues.title,
                    description: item.dataValues.description,
                    solveDate: item.dataValues.solveDate,
                    createdAt: item.dataValues.createdAt,
                    updateAt: item.dataValues.updatedAt,
                    links: links});
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
            console.log('[ISSUES] - Migration finished.');
            console.log('[ISSUES] - Items migrated: '+succeededCount);
            console.log('[ISSUES] - Items failed: ' +failedCount);

            if(finishedCallback)
                finishedCallback();
        });

    });
};

module.exports.migrateUsers = function(finishedCallback){
    console.log('[USERS] - Migration started.');
    sourceModels.user.findAll({attributes:['id']}).then(function(res){
        var ids = [];
        for(var i in res){
            if(res.hasOwnProperty(i))
                ids.push(res[i].dataValues.id);
        }

        var succeededCount = 0;
        var failedCount = 0;
        var iterator = 0;

        async.map(ids, function(element, callback){
            sourceModels.user.findById(element).then(function(item){
                var User = new destUser({
                    username: item.dataValues.username,
                    fullName: item.dataValues.fullname,
                    password: item.dataValues.password
                });
                User.save(function(err){
                    if(err) {
                        failedCount++;
                    }else{
                        succeededCount++;
                    }

                    iterator++;
                    var percentage = (iterator*100.0/(ids.length));
                    console.log(percentage+'%');
                    callback(err, null);
                })
            })
        }, function(err, result){
            if(err){
                console.log(err);
            }
            console.log('[USERS] - Migration finished.');
            console.log('[USERS] - Items migrated: '+succeededCount);
            console.log('[USERS] - Items failed: ' +failedCount);

            if(finishedCallback)
                finishedCallback();
        });
    });
};