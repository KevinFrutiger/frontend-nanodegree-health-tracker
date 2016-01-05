var app = app || {};

(function() {
  'use strict';

  var FoodItems = Backbone.Collection.extend({
    model: app.Todo,

    localStorage: new Backbone.LocalStorage('food-items-backbone')
  });

  app.foodItems = new FoodItems();

})();