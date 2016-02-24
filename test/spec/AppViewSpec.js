(function() {
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

      expect(modelHasWrongDate).toEqual(false);
    });

    it('renders all saved list items to the page', function() {
      expect($('.saved-list-item').length).toEqual(app.savedList.models.length);
    });

    it('renders the calorie total as equal to the sum ' +
       'of the calories in the list', function() {
      var calorieTotal = Number($('#calorie-total').text());
      var savedCalories = [];

      $('.saved-list-item .calories').each(function() {
        savedCalories.push( Number( $(this).text() ) );
      });

      var savedListItemCaloryTotal = savedCalories.reduce(function(prev, curr) {
          return prev + curr;
        });

      expect(calorieTotal).toEqual(savedListItemCaloryTotal);
    });
  });

})();