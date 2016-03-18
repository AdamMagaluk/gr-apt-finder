var Checker = require('./check_parcel');

var parcelChecker = new Checker();

parcelChecker.check(process.argv[2], function(err, result) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  if (result) {
    console.log(result);
  }
});

