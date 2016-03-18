var path = require('path');
var Parser = require('node-dbf');
var async = require('async');
var Checker = require('./check_parcel');
var csv = require('fast-csv');

var MAX_HTTP = 25;

var parser = new Parser(process.argv[2]);
var parcelChecker = new Checker();
var csvStream = csv.createWriteStream({ headers: true });
csvStream.pipe(process.stdout);

var parcels = [];

parser.on('record', function(record) {
  parcels.push(record.PNUM);
});

parser.on('end', function(p) {
  var results = [];

//  parcels = parcels.slice(0, 100);

  var count = 0;
  async.eachLimit(parcels, MAX_HTTP, function(parcelId, next) {
    parcelChecker.check(parcelId, function(err, result) {
      if (err) {
        return next(err);
      }

      if (result) {
        csvStream.write(result);
      }

      count++;
      if (count % 100 === 0) {
        console.error('Current count:', count, Math.round(count/parcels.length*100));
      }
      
      next();
    });
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
      return;
    }
    csvStream.end();
    process.exit(0);
  });
});

parser.parse();
