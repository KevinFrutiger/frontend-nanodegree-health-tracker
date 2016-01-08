var app = app || {};

(function() {
  'use strict';

  app.FoodItem = Backbone.Model.extend({

    defaults: {
      name: '',
      calories: null,
      timestamp: null
    }

  });

})();