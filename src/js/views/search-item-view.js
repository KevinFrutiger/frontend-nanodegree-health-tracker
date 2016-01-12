var app = app || {};

(function() {
  'use strict';

  app.SearchItemView = Backbone.View.extend({

    tagName: 'li',

    className: 'search-list-item',

    template: _.template($('#search-item-template').html()),

    events: {
      'click': 'select',
      'keypress': 'select'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      // Allow keyboard users to focus the el in document order.
      this.$el.prop('tabindex', '0');

      this.$el.html(this.template(this.model.attributes));

      return this;
    },

    select: function(event) {
      if (event.type === 'click' || event.which === app.ENTER_KEY) {
        app.eventBus.trigger('selectSearchItem', this);
      }
    }

  });

})();