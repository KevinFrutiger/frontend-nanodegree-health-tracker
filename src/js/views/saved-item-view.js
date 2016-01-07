var app = app || {};

(function() {
  'use strict';

  app.SavedItemView = Backbone.View.extend({

    tagName: 'li',

    template: _.template($('#food-item-template').html()),

    events: {
      //
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      return this;
    }

  });

})();