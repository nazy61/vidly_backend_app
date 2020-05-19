const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  // logging errors using winston to files
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  // logging errors using wiston to mongodb
  // winston.add(new winston.transports.MongoDB({
  //   db: 'mongodb://localhost/vidly_mine',
  //   level: 'info'
  // }));
}