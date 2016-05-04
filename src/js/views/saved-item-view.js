var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a view for a food item that's saved to LocalStorage.
   */
  app.SavedItemView = Backbone.View.extend({

    tagName: 'tr',

    className: 'saved-list-item',

    template: _.template($('#saved-item-template').html()),

    events: {
      'click .remove-item': 'removeMe'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      return this;
    },

    /**
     * Removes the view.
     */
    removeMe: function() {
      var self = this;

      // When model is confirmed destroyed, remove the view.
      this.model.destroy({success: function(model, response) {
          self.remove();
      }});
    }

  });

})();