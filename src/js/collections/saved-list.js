var app = app || {};

(function() {
  'use strict';

  var SavedList = Backbone.Collection.extend({
    model: app.FoodItem,

    localStorage: new Backbone.LocalStorage('food-items-backbone'),

    getCalorieTotal: function() {
      return this.reduce(function(total, model) {
        return total + model.get('calories');
      }, 0);
    }
  });

  app.savedList = new SavedList();

})();