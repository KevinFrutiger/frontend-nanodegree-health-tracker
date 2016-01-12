var app = app || {};

(function() {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: '#health-tracker-app',

    events: {
      'keypress #search-input': 'searchOnUserInput',
      'focus #search-input': 'resetInputFeedback',
      'click #search-btn': 'searchOnUserInput',
      'click #search-list-close-btn': 'removeSearchList'
    },

    initialize: function() {
      var self = this;

      console.log('initializing the app view');
      this.$jqXHR = null;

      this.$searchInput = this.$('#search-input');
      this.$searchList = this.$('#search-list');
      this.$searchListContainer = this.$('#search-list-container');
      this.$savedList = this.$('#saved-list');
      this.$calorieTotal = this.$('#calorie-total');
      this.$status = this.$('#status');

      this.listenTo(app.searchList, 'remove', this.removeSearchList);
      this.listenTo(app.savedList, 'add', this.addSavedItemView);
      this.listenTo(app.savedList, 'update', this.render);
      this.listenTo(app.savedList, 'reset', this.render);
      this.listenTo(app.eventBus, 'selectSearchItem', this.selectSearchItem);

      this.fetching = true;

      app.savedList.fetch({success: function() {
                              self.fetching = false;
                              self.filterTodaysItems();
                            }
                          });
    },

    render: function() {
      this.$calorieTotal.text(app.savedList.getCalorieTotal().toFixed());
    },

    filterTodaysItems: function() {

      console.log(app.savedList);

      var todaysModels = _.filter(app.savedList.models, function(model) {
        var date = new Date(model.get('timestamp')).setHours(0, 0, 0, 0);
        var today = new Date().setHours(0, 0, 0, 0);

        return date == today;

      });

      app.savedList.reset(todaysModels);

      console.log(app.savedList);

      _.each(todaysModels, this.addSavedItemView, this);
    },

    addSavedItemView: function(foodItem) {
      if (!this.fetching) {
        var view = new app.SavedItemView({model: foodItem});
        var $el = view.render().$el;

        $el.hide();
        this.$savedList.append($el);
        $el.show(300);
      }
    },

    searchOnUserInput: function(event) {
      if (event.which === app.ENTER_KEY || event.type === 'click') {
        var value = this.$searchInput.val().trim();

        if (value) {
          this.removeSearchList();

          this.queryHealthAPI(value);
          this.$searchInput.val('');
          this.$searchInput.prop('placeholder', 'Searching...');
          this.$searchInput.prop('disabled', true);
        } else {
          this.$searchInput.parent().addClass('has-error');
          this.$searchInput.prop('placeholder',
                                 'Please enter food by name or brand');
        }
      } else {
        this.resetInputFeedback();
      }
    },

    resetInputFeedback: function(event) {
      this.$searchInput.parent().removeClass('has-error');
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
                          fields: '*'
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
                      self.$searchInput.parent().addClass('has-error');
                      self.$searchInput.prop('placeholder',
                                            'Oops. There was a network error.');
                    });
    },

    createSearchList: function(results) {
      app.searchList.comparator = 'brand';

      for (var i = 0, len = results.length; i < len; i++) {
        var fields = results[i].fields;

        app.searchList.add(new app.FoodItem({
            name: fields.item_name,
            brand: fields.brand_name,
            calories: fields.nf_calories,
            serving_size_qty: fields.nf_serving_size_qty,
            serving_size_unit: fields.nf_serving_size_unit
        }));
      }

      this.showSearchList();

    },

    showSearchList: function() {
      _.each(app.searchList.models, this.addSearchItemView, this);

      if (this.$searchListContainer.css('display') === 'none') {
        this.$searchListContainer.show();
      }
    },

    addSearchItemView: function(foodItem) {
      var view = new app.SearchItemView({model: foodItem});
      this.$searchList.append(view.render().$el);
    },

    selectSearchItem: function(view) {
      var model = app.searchList.remove(view.model);
      model.set('timestamp', Date.now());
      app.savedList.create(model);

      this.removeSearchList();
    },

    removeSearchList: function() {
      app.searchList.reset();
      this.$searchList.empty();
      this.$searchListContainer.hide();
    }

  });

})();