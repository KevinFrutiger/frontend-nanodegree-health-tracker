var app = app || {};

(function() {

  app.FoodItemView = Backbone.View.extend({

    tagName: 'li',

    template: _.template('This is the template content.');

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      return this;
    }

  });

})();