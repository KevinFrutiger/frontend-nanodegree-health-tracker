$(function() {
  'use strict';

  describe('AppView', function() {
    it('initializes saved list with only today\'s items', function() {
      expect(app.savedList).toBeDefined();

      var modelHasWrongDate = _.some(app.savedList.models, function(model) {
          var date = new Date(model.get('timestamp')).setHours(0, 0, 0, 0);
          var today = new Date().setHours(0, 0, 0, 0);

          return date != today;
        }
      );

      expect(modelHasWrongDate).toBe(false);
    });

    it('renders all saved list items to the page', function() {
      expect($('.saved-list-item').length).toEqual(app.savedList.models.length);
    });

    it('renders the calorie total as equal to the sum ' +
       'of the calories in the list, or 0 if there\'s no list', function() {
      var calorieTotal = Number($('#calorie-total').text());
      var savedCalories = [];

      $('.saved-list-item .calories').each(function() {
        savedCalories.push( Number($(this).text()) );
      });

      if (savedCalories.length > 0) {
        var savedListItemCaloryTotal = savedCalories.reduce(function(prev, curr) {
            return prev + curr;
          });
        expect(calorieTotal).toEqual(savedListItemCaloryTotal);
      } else {
        expect(calorieTotal).toEqual(0);
      }

    });

    var testValue = 'hamburger';

    beforeAll(function(done) {
      spyOn(app.appView, 'queryHealthAPI').and.callThrough();

      var $input = $('#search-input');
      var $searchButton = $('#search-btn');

      $input.val(testValue);
      $searchButton.trigger('click');

      var timeout = setTimeout(function() {
        done();
      }, 1000);

    });

    it ('queries API on user click with value', function() {

      expect(app.appView.queryHealthAPI).toHaveBeenCalledWith(testValue);

    });

    it ('show list of results', function(done) {

      expect($('#search-list-container').css('display')).not.toEqual('none');

      expect($('.search-list-item').length).toBeGreaterThan(0);

      done();
    });
  });

});