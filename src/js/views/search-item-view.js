var app = app || {};

(function() {
  'use strict';

  app.SearchItemView = Backbone.View.extend({

    tagName: 'button',

    className: 'list-group-item',

    template: _.template($('#search-item-template').html()),

    events: {
      'click': 'select'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      return this;
    },

    select: function() {
      app.eventBus.trigger('selectSearchItem', this);
    }

  });

})();