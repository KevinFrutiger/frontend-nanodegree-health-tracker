var app = app || {};

(function() {
  'use strict';

  /**
   * Creates a view for the entire app.
   */
  app.AppView = Backbone.View.extend({
    el: '#health-tracker-app',

    events: {
      'keypress #search-input': 'searchOnUserInput',
      'focus #search-input': 'resetInputFeedback',
      'click #search-btn': 'searchOnUserInput',
      'click #search-list-close-btn': 'removeSearchList'
    },

    searchFeedbackStrings: {
      DEFAULT: 'Search for food by name or brand',
      AJAX_IN_PROGRESS: 'Searching...',
      AJAX_FAIL: 'Oops. There was a network error.',
      EMPTY_INPUT: 'Please enter food by name or brand'
    },

    /**
     * Initializes view
     */
    initialize: function() {

      this.$jqXHR = null;

      this.$searchInput = this.$('#search-input');
      this.$searchList = this.$('#search-list');
      this.$searchListContainer = this.$('#search-list-container');
      this.$savedList = this.$('#saved-list');
      this.$calorieTotal = this.$('#calorie-total');

      this.$searchInput.prop('placeholder', this.searchFeedbackStrings.DEFAULT);

      this.listenTo(app.searchList, 'remove', this.removeSearchList);
      this.listenTo(app.savedList, 'add', this.addSavedItemView);
      this.listenTo(app.savedList, 'update', this.renderCalorieTotal);
      this.listenTo(app.savedList, 'reset', this.renderCalorieTotal);
      this.listenTo(app.eventBus, 'selectSearchItem', this.selectSearchItem);

      var self = this;
      this.fetching = true;

      app.savedList.fetch({success: function() {
                              self.fetching = false;
                              self.filterTodaysItems();
                            }
                          });
    },

    /**
     * Renders the current calorie total.
     */
    renderCalorieTotal: function() {
      this.$calorieTotal.text(app.savedList.getCalorieTotal().toFixed());
    },

    /**
     * Resets the saved list collection to models with timestamps for today.
     */
    filterTodaysItems: function() {

      var todaysModels = _.filter(app.savedList.models, function(model) {
        var date = new Date(model.get('timestamp')).setHours(0, 0, 0, 0);
        var today = new Date().setHours(0, 0, 0, 0);

        return date == today;

      });

      app.savedList.reset(todaysModels);

      _.each(todaysModels, this.addSavedItemView, this);
    },

    /**
     * Adds a view for the provided food item model.
     */
    addSavedItemView: function(foodItem) {
      if (!this.fetching) {
        var view = new app.SavedItemView({model: foodItem});
        var $el = view.render().$el;

        $el.hide();
        this.$savedList.append($el);
        $el.show(300);
      }
    },

    /**
     * Handles user Enter/Click to initiate search query to API.
     */
    searchOnUserInput: function(event) {
      if (event.which === app.ENTER_KEY || event.type === 'click') {
        var value = this.$searchInput.val().trim();

        if (value) {
          this.removeSearchList();

          this.queryHealthAPI(value);

          // Give feedback to the user that search is in progress.
          this.$searchInput.val('');
          this.$searchInput.prop('placeholder',
                                 this.searchFeedbackStrings.AJAX_IN_PROGRESS);
          this.$searchInput.prop('disabled', true);
        } else {
          // Give feedback that user goofed input.
          this.$searchInput.parent().addClass('has-error');
          this.$searchInput.prop('placeholder',
                                 this.searchFeedbackStrings.EMPTY_INPUT);
        }
      } else {
        // User is typing, so clear out any existing feedback.
        this.resetInputFeedback();
      }
    },

    /**
     * Resets the input feedback.
     */
    resetInputFeedback: function(event) {
      this.$searchInput.parent().removeClass('has-error');
    },

    /**
     * Handles the AJAX request to the API.
     */
    queryHealthAPI: function(value) {
      var self = this;

      // Query the health API.
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

                      // Reset the input field.
                      self.$searchInput.prop('disabled', false);
                      self.$searchInput.prop(
                          'placeholder', self.searchFeedbackStrings.DEFAULT);

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                      console.log('ajax failed');

                      self.$searchInput.prop('disabled', false);

                      // Give feedback to user.
                      self.$searchInput.parent().addClass('has-error');
                      self.$searchInput.prop(
                          'placeholder', self.searchFeedbackStrings.AJAX_FAIL);
                    });
    },

    /**
     * Creates the search list collection and displays the search list.
     */
    createSearchList: function(results) {
      // Sort by brand as we add models.
      app.searchList.comparator = 'brand';

      // Add a model for each result.
      results.forEach(function(result) {
          var fields = result.fields;

          app.searchList.add(new app.FoodItem({
              name: fields.item_name,
              brand: fields.brand_name,
              calories: fields.nf_calories,
              serving_size_qty: fields.nf_serving_size_qty,
              serving_size_unit: fields.nf_serving_size_unit
          }));

      });

      this.showSearchList();

    },

    /**
     * Adds views for each item and displays the search list.
     */
    showSearchList: function() {
      // Add a view for each model.
      _.each(app.searchList.models, this.addSearchItemView, this);

      // Show the list if it's currently hidden.
      if (this.$searchListContainer.css('display') === 'none') {
        this.$searchListContainer.show();
      }
    },

    /**
     * Creates a view for a search item and appends its element to the list.
     */
    addSearchItemView: function(foodItem) {
      var view = new app.SearchItemView({model: foodItem});
      this.$searchList.append(view.render().$el);
    },

    /**
     * Handles user selection of a search item. Moves the selected
     * model to the saved list.
     */
    selectSearchItem: function(view) {
      // Remove the model from the search list.
      var model = app.searchList.remove(view.model);

      // Add the model to the saved list.
      model.set('timestamp', Date.now());
      app.savedList.create(model);

      this.removeSearchList();
    },

    /**
     * Removes the search list from the page.
     */
    removeSearchList: function() {
      app.searchList.reset();
      this.$searchList.empty();
      this.$searchListContainer.hide();
    }

  });

})();