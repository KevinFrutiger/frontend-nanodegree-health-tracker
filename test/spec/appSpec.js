$(function() {
  'use strict';

  describe('App', function() {

    it('creates global app', function() {
      expect(app).toBeDefined();
    });

    it('defines ENTER_KEY as the keycode for the Enter key', function() {
      expect(app.ENTER_KEY).toBe(13);
    });

    it('creates app.eventBus as a copy of Backbone.Events', function() {
      expect(app.eventBus).toEqual(Backbone.Events);
    });

    it('creates app.appView as an instance of app.AppView', function() {
      expect(app.appView).toEqual(jasmine.any(app.AppView));
    });

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
       'of the calories in the list', function() {

      var calorieTotal = Number($('#calorie-total').text());
      var itemCalorieTotal = totalRenderedItemCalories();

      expect(calorieTotal).toEqual(itemCalorieTotal);

    });

  });

    describe('Search functionality:', function() {

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

      describe('Search button', function() {
        it ('queries API on click with value', function(done) {

          expect(app.appView.queryHealthAPI).toHaveBeenCalledWith(testValue);

          done();

        });
      });

      it ('list of results shows after search', function(done) {

        expect($('#search-list-container').css('display')).not.toEqual('none');

        expect($('.search-list-item').length).toBeGreaterThan(0);

        done();

      });

      describe('close button', function() {
        it('clears and closes search list', function(done) {
          var $closeBtn = $('#search-list-close-btn');
          $closeBtn.trigger('click');

          expect($('#search-list-container').css('display')).toEqual('none');
          expect($('.search-list-item').length).toBe(0);

          done();
        });
      });
    });

    describe('Search functionality: Selecting item', function() {

      var prevSavedListLength;

      beforeAll(function(done) {
        setTimeout(function() {
          $('#search-input').val('chicken');
          $('#search-btn').trigger('click');

          setTimeout(function() {
            prevSavedListLength = $('.saved-list-item').length;
            $('.search-list-item').first().trigger('click');
            done();
          }, 1000);
        }, 3000);

      });

      it('clears and closes search list', function(done) {
        var $closeBtn = $('#search-list-close-btn');
        $closeBtn.trigger('click');

        expect($('#search-list-container').css('display')).toEqual('none');
        expect($('.search-list-item').length).toBe(0);

        done();
      }, 5000);

      it('moves item to saved list', function(done) {
        var newSavedListLength = $('.saved-list-item').length;

        expect(newSavedListLength).toBeGreaterThan(prevSavedListLength);

        done();
      }, 5000);

      it('updates calorie total to sum of items', function(done){

        var calorieTotal = Number($('#calorie-total').text());
        var itemCalorieTotal = totalRenderedItemCalories();

        expect(calorieTotal).toEqual(itemCalorieTotal);

        done();

      }, 5000);

    });


  function totalRenderedItemCalories() {
    var savedCalories = [];

    $('.saved-list-item .calories').each(function() {
      savedCalories.push( Number($(this).text()) );
    });

    var total = savedCalories.reduce(function(prev, curr) {
                  return prev + curr;
                }, 0);

    return total;
  }

});