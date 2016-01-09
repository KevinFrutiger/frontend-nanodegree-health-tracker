var app = app || {};

(function() {
  'use strict';

  app.FoodItem = Backbone.Model.extend({

    defaults: {
      name: '',
      brand: '',
      calories: '',
      serving_size_qty: null,
      serving_size_unit: null
    }

  });

})();