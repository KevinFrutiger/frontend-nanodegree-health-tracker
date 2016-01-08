var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#health-tracker-app',

    events: {
      'keypress #search-input': 'searchOnEnter'
    },

    initialize: function() {
      console.log('initializing the app view');
      this.$jqXHR = null;

      this.$searchInput = this.$('#search-input');
      this.$searchList = this.$('#search-list');
      this.$savedList = this.$('#saved-list');
      this.$calorieTotal = this.$('#calorie-total');
      this.$status = this.$('#status');

      this.listenTo(app.searchList, 'add', this.addSearchItem);
      this.listenTo(app.searchList, 'remove', this.removeSearchList);
      this.listenTo(app.savedList, 'add', this.addOne);
      this.listenTo(app.savedList, 'update', this.render);
      this.listenTo(app.eventBus, 'selectItem', this.selectItem);

      var self = this;

      app.savedList.fetch();
    },

    render: function() {
      this.$calorieTotal.text(app.savedList.getCalorieTotal().toFixed());
    },

    addOne: function(foodItem) {
      var view = new app.SavedItemView({model: foodItem});
      this.$savedList.append(view.render().$el);
    },

    searchOnEnter: function(event) {
      var value = this.$searchInput.val().trim();

      if (event.which === app.ENTER_KEY && value) {
        this.queryHealthAPI(value);
        this.$searchInput.val('');
        this.$searchInput.prop('placeholder', 'Searching...');
        this.$searchInput.prop('disabled', true);
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
                      if (!data.hits) console.warn('no hits');
                      self.createSearchList(data.hits);

                      self.$searchInput.prop('disabled', false);
                      self.$searchInput.prop('placeholder',
                                             'Enter a food name to search');

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                      console.log('ajax failed');
                      self.$searchInput.prop('disabled', false);
                      self.$searchInput.prop('placeholder',
                                       'Oops, there was an error.');
                    });
    },

    createSearchList: function(results) {
      for (var i = 0, len = results.length; i < len; i++) {
        app.searchList.add(new app.FoodItem({
            name: results[i].fields.item_name,
            calories: results[i].fields.nf_calories
        }));
      }
    },

    addSearchItem: function(foodItem) {
      var view = new app.SearchItemView({model: foodItem});
      this.$searchList.append(view.render().$el);
    },

    selectItem: function(view) {
      app.savedList.create(app.searchList.remove(view.model));

      this.removeSearchList();
    },

    removeSearchList: function() {
      app.searchList.reset();
      this.$searchList.empty();

      //this.$searchInput.focus();
    }

  });

})();