(function (global, m) {
    'use strict';
    var app = global.app = global.app || {};
    //In Mithril controllers are rather "slim".
    //Here we init the model (the model will call the Northwind-Service-API and prepare JSON-data)
    app.controller = function () {
        app.vm.init();
    };

}(window, Mithril));