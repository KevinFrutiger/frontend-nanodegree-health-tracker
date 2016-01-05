var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#health-tracker-app',

    initialize: function() {
      console.log('initializing the app view');
    }
  });

})();