(function (global, m) {
    'use strict';
    var app = global.app = global.app || {};
    m.startComputation();
    //Start the Mithril app.
    //A proper Mithril app needs a component that contains a controller and a view.
    //There are no special rules regarding models. In this example the model relies upon the public demo-service "Northwind" from MS
    //http://services.odata.org/Northwind/Northwind.svc/ - the processing of JSON-data is done in demo.model.js
    //The controller (demo.controller.js) initializes the model by calling its "init" method.
    //The view uses the preprocessed data to fill the grid and wire up the events.
    m.module(document.getElementById('mithril-app'), { controller: app.controller, view: app.view });
    m.endComputation();
}(window, m));