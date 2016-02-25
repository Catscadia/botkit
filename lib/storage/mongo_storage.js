/*
  Storage module for bots.

  Store data in MongoDB.


  save can be used to store arbitrary object.
  These objects must include an id by which they can be looked up.
  It is recommended to use the team/user/channel id for this purpose.
  Example usage of save:
  controller.storage.teams.save({id: message.team, foo:"bar"}, function(err){
  if (err)
  console.log(err)
  });

  get looks up an object by id.
  Example usage of get:
  controller.storage.teams.get(message.team, function(err, team_data){
  if (err)
  console.log(err)
  else
  console.log(team_data)
  });

 */

var mongojs = require('mongojs')

module.exports = function(config) {
    if ((!config) || (!config.url)) {
        throw "please specify the MONGO_URL environment variable";
    }
    var db = mongojs(config.url);
    var storage = {}
    methods = config.methods || ['teams', 'users', 'channels']

    // XXX: We are using a somewhat wonky design pattern -- we reconnect each
    // time. Ideally, we want to keep an ongoing connection, and make sure to
    // reconnect iff we need to (and then set up a method to clean it up if
    // needed). This will work for now.
    var fns = function(coll) {
        return {
            get: function(id, cb) {
                var db = mongojs(config.url);
                var cbF = function (err, data) { db.close(); cb(err, data); };
                return db.collection(coll).findOne({_id: id}, cbF);
            },
            save: function(data, cb) {
                var db = mongojs(config.url);
                var cbF = function (err) { db.close(); cb(err); };
                return db.collection(coll).update({_id: data.id}, data, {upsert: true}, cbF)
            },
            all: function(cb) {
                var db = mongojs(config.url);
                var cbF = function (err, data) { db.close(); cb(err, data); };                
                return db.collection(coll).find(cbF)
            }              
        };
    }


    var storage = {
        teams: fns("teams"),
        users: fns("users"),
        channels: fns("channels"),
    }
    return storage;
   
};


