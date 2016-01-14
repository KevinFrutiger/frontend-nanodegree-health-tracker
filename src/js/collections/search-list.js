var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a collection to handle non-persistent models generated from search
   * results.
   */
  var SearchList = Backbone.Collection.extend({
    model: app.FoodItem

  });

  app.searchList = new SearchList();

})();