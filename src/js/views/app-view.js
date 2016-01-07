var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#health-tracker-app',

    events: {
      'keypress #search': 'searchOnEnter'
    },

    initialize: function() {
      console.log('initializing the app view');
      this.$jqXHR = null;

      this.$input = this.$('#search');
      this.$searchList = this.$('#search-list');
      this.$savedList = this.$('#saved-list');

      this.listenTo(app.searchList, 'add', this.addSearchItem);
      this.listenTo(app.searchList, 'remove', this.removeSearchList);
      this.listenTo(app.savedList, 'add', this.addOne);
      //this.listenTo(app.savedList, 'destroy', this.removeOne);
      this.listenTo(app.eventBus, 'selectItem', this.selectItem);

      app.savedList.fetch();
    },

    render: function() {
      //
    },

    addOne: function(foodItem) {
      console.log('added model to savedList');
      var view = new app.SavedItemView({model: foodItem});
      this.$savedList.append(view.render().$el);
    },

    searchOnEnter: function(event) {
      var value = this.$input.val().trim();

      if (event.which === app.ENTER_KEY && value) {
        this.queryHealthAPI(value);
        this.$input.val('');
        this.$input.prop('placeholder', 'Searching...');
        this.$input.prop('disabled', true);
      }
    },

    queryHealthAPI: function(value) {
      var self = this;

      this.$jqXHR = $.ajax({
                        url: 'https://api.nutritionix.com/v1_1/search/' + value,
                        dataType: 'json',
                        data: {
                          appId: '30fc0f57',
                          appKey: '847b2a751b496a8e6e8c3a2d4f5bc20d',
                          results: '0:20',
                          fields: 'item_name,brand_name,item_id,brand_id,' +
                                  'nf_calories,nf_serving_size_qty,'+
                                  'nf_serving_size_unit'
                        }
                    })
                    .done(function(data, status, jqXHR) {
                      console.log('ajax is done');
                      self.createSearchList(data.hits);

                      self.$input.prop('disabled', false);
                      self.$input.prop('placeholder', 'Enter a food name to search');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                      console.log('ajax failed');
                      self.$input.prop('disabled', false);
                      self.$input.prop('placeholder',
                                       'Oops, there was an error.');
                    });
    },

    createSearchList: function(results) {
      console.log(results);

      for (var i = 0, len = results.length; i < len; i++) {
        app.searchList.add(new app.FoodItem({
            name: results[i].fields.item_name,
            calories: results[i].fields.nf_calories
        }));
      }

      console.log(app.searchList);
    },

    addSearchItem: function(foodItem) {
      var view = new app.SearchItemView({model: foodItem});
      this.$searchList.append(view.render().$el);
    },

    selectItem: function(view) {
      app.savedList.create(app.searchList.remove(view.model));

      //this.$savedList.append(view.$el);

      this.removeSearchList();
    },

    removeSearchList: function() {
      app.searchList.reset();
      this.$searchList.empty();

      //this.$input.focus();
    }

  });

})();