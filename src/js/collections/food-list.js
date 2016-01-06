var app = app || {};

(function() {
  'use strict';

  var SavedList = Backbone.Collection.extend({
    model: app.FoodItem,

    localStorage: new Backbone.LocalStorage('food-items-backbone')
  });

  app.savedList = new SavedList();

})();