var app = app || {};

(function() {
  'use strict';

  app.SavedItemView = Backbone.View.extend({

    tagName: 'tr',

    template: _.template($('#saved-item-template').html()),

    events: {
      'click #remove': 'removeMe'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    render: function() {
      this.$el.html(this.template(this.model.attributes));

      return this;
    },

    removeMe: function() {
      var self = this;

      this.model.destroy({success: function(model, response) {
          self.remove();
      }});
    }

  });

})();