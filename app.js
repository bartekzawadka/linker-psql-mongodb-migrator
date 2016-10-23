var sourceModels = require('./models/source');
var mongoose = require('mongoose');
var config = require('./config');
var migrator = require('./migrator');

sourceModels.sequelize.sync().then(function(){
   console.log('Source database synced successfully');

   // var mongoconnection = mongoose.connect(config.destination.host, {
   //    db: config.destination.database,
   //    user: config.destination.username,
   //    pass: config.destination.password
   // });
   var mongoconnection = mongoose.connect('mongodb://linker_user:dba154@esmeralda.westeurope.cloudapp.azure.com/linker');

   mongoose.connection.on('error', function(err){
      console.log('[ERROR] app.js MongoDB Connection Error. Please make sure that MongoDB is running.');
      console.log(err);
      process.exit(1);
   });
   mongoose.connection.on('open', function(){
      console.log('[INFO] app.js Connected to mongo server.');

      console.log('Starting migration...');
      migrator.migrate();
   });
});