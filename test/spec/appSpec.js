describe('app.js', function() {

  it('should create global app', function() {
    expect(app).toBeDefined();
  });

  it('should define ENTER_KEY as the keycode for the Enter key', function() {
    expect(app.ENTER_KEY).toBe(13);
  });

  it('should create app.eventBus as a copy of Backbone.Events', function() {
    expect(app.eventBus).toEqual(Backbone.Events);
  });

  it('should create app.appView as an instance of app.AppView', function() {
    expect(app.appView).toEqual(jasmine.any(app.AppView));
  });

});