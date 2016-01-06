var app = app || {};

(function() {
  'use strict';

  // Non-persistent collection.

  var SearchList = Backbone.Collection.extend({
    model: app.FoodItem

  });

  app.searchList = new SearchList();

})();