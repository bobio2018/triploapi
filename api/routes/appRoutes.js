'use strict';
module.exports = function(app) {
  var controller = require('../controllers/appController');

  app.route('/api/request')
    .post(controller.create_api_request);

};
