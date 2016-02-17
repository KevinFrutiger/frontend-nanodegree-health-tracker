var app = app || {};

app.ENTER_KEY = 13;

$(function() {
  'use strict';

  app.eventBus = _.extend(Backbone.Events);

  // Start the app.
  console.log('starting the app');
  app.appView = new app.AppView();


});