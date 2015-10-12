var request = require('superagent');
var graylog2 = require("graylog2");
var timer;
var createdID;

var logger = new graylog2.graylog({
    servers: [
        { 'host': '40.118.19.111', port: 12201 }
    ],
    hostname: 'bee',
    facility: 'Node.js'
});

// logger.info("test");

request
  .post('http://traditional-api.cloudapp.net:3000/objects')
  .set('Accept', 'application/json')
  .end(function(err, res){
    createdID = res.body._id;
    timer = setInterval(function() {
      if (Math.random() < 0.3) {
        request
          .post('http://traditional-api.cloudapp.net:3000/objects')
          .set('Accept', 'application/json')
          .end(function(err, res){
            createdID = res.body._id;
          });
      } else {
        request
          .get('http://traditional-api.cloudapp.net:3000/objects/'+createdID)
          .end(function(err, res) {
            request
              .put('http://traditional-api.cloudapp.net:3000/objects/'+createdID)
              .send({ text: (parseInt(res.body.text) + 1) })
              .end(function(err, res) {
                console.log(res.body);
              });
          });
      }
    }, 500);
  });

function terminate() {
  clearInterval(timer);
  logger.log("Successfully exited");
  setTimeout(function() {process.exit(0);}, 500);
  
}

process.on('uncaughtException', function (err) {
  logger.log(err);
  setTimeout(function() {process.exit(8);}, 500);
})

process.on('SIGINT', function() {
  terminate();
});
process.on('SIGTERM', function() {
  terminate();
});