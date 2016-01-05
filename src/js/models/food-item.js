var app = app || {};

(function() {
  'use strict';

  app.FoodItem = Backbone.Model.extend({

    defaults: {
      name: '',
      calories: null,
      date: function() { return new Date(); }
    }

  });

})();