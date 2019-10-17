'use strict';
module.exports = function(app) {
  var controller = require('../controllers/appController');

  app.route('/api/request')
    .get(controller.create_api_request);

};
