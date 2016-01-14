var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a collection for handling models that are saved to LocalStorage.
   */
  var SavedList = Backbone.Collection.extend({
    model: app.FoodItem,

    localStorage: new Backbone.LocalStorage('food-items-backbone'),

    /**
     * Returns the total calories for the entire collection.
     */
    getCalorieTotal: function() {
      return this.reduce(function(total, model) {
        return total + model.get('calories');
      }, 0);
    }
  });

  app.savedList = new SavedList();

})();