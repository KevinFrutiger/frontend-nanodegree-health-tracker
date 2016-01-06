var app = app || {};

(function() {

  app.FoodItemView = Backbone.View.extend({

    tagName: 'li',

    template: _.template('This is the template content.'),

    events: {
      'click': 'select'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template());

      return this;
    },

    select: function() {
      app.eventBus.trigger('selectItem', this);
    }

  });

})();