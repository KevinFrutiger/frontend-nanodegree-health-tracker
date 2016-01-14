# Health Tracker project

This was an optional seventh project for the Udacity Front-End Nanodegree. The objective was to build an app that utilized Backbone and a health API to allow the user to count the day's calories.

## Running the application

You can run the application [here](http://kevinfrutiger.github.io/frontend-nanodegree-health-tracker/).

### Running locally

1. Download the .zip file using the **Download ZIP** button located in the GitHub UI (or clone the repository).
2. Unzip the file
3. Start an HTTP server, such as [http-server](https://www.npmjs.com/package/http-server) (requires NodeJS and NPM) or [MAMP](https://www.mamp.info/en/).
3. Point your browser to the index.html in src/ or in dist/.

**Running locally without a web server**

If you'd like to load index.html in your browser without going through a web server, you'll need to update a few `<script>` tags at the bottom of index.html. For any tag with a `src` attribute that starts with `//`, you'll need to prepend `http:` to that path, otherwise the browser assumes `file:` and can't locate those scripts.

## Using the application ##

To start using the application:

1. Enter a name of a food item (e.g. chicken) or a brand name (e.g. McDonald's) in the text input.
2. Click/tap the search icon or press **Enter**. The app will query the Nutrionix API and return a list of results.
  * You can search again while the search results list is open. The current resuts will be replaced by results from the new search.
  * The app currently only shows the first 20 results from the API in alphabetical order by brand.
3. Click/tap an item to add it to your list.
  * You can close the search results without selecting an item by using the close button (**×**) a the top of the search results.
4. The item you selected will appear on your total calorie count list, and your total calories for today will update to include the new item.
5. You can remove an item from your saved list by clicking the remove button (**×**) next to an item.

The app uses your browser's local storage to store selected food items. You can close your browser and open it at a later time to add more items to your existing list. The app only shows today's items, so if you open the app tomorrow, the list will be empty until you add more items. Note, however, that items from past days are still in your browser's storage.

**Clearing saved data**

If you'd like to clear all the data stored by the app (including today's items), you'll need to clear your local storage. See your browser's documentation regarding "Local storage". On Chrome, you can access it by entering "chrome://settings/cookies" in the address bar. The data is saved under the site *kevinfrutiger.github.io*. Alternatively, you can enter "localStorage.clear()" in Chrome's Developer tools console while viewing the app.

## Building the serving files ##

Files located in the src/ folder are the readable source files and you can run the app with those files directly. The file located in dist/ is the compacted version intended for serving. To refresh the dist/ files, you'll need to have **N**ode **P**ackage **M**anager (part of [NodeJS](https://nodejs.org/en/download/)) and [Grunt](http://gruntjs.com/).

From the main directory (via command line), install the required packages:

````shell
npm install
````

After the modules are installed, build the dist/ folder:

````shell
grunt build
````

If you don't already know, the .htaccess file is a settings file for a server used in this case to enable compression and caching. It is not required to run the app.

If for some reason you wish to play around with this, you'll need to register for your own [Nutritionix API](https://developer.nutritionix.com/docs/v1_1) key and replace the data properties in queryHealthAPI() located in src/js/views/app-view.js (approx. line 140).