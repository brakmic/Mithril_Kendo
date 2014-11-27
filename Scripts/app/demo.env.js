(function (global, m) {
    'use strict';
    var app = global.app = global.app || {};
    app.FIREBASE_URL = 'YOUR_FIREBASE_URL',
    //authenticate Firebase services
    app.fireAuth = function (fire, user, pwd) {
        fire.authWithPassword({
            email: user,
            password: pwd
        }, function (error, authData) {
            if (error === null) {
                // user authenticated with Firebase
                console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
            } else {
                console.log("Error authenticating user: ", error);
            }
        });
    };
    //Here we use Mithrils "request" method to connect the Service and get the data.
    //Optionally we could predefine a "model class" and let Mithril process data according to its properties.
    //For example:
    //var Customer = {
    //      id: jsonData.CustomerID,
    //      name: jsonData.CustomerName,
    //      company: jsonData.CompanyName
    //  }
    //
    //then we'd call the same m.request method with an additional parameter: "type":
    //      m.request = ( method: "GET", url: "service_url", type: Customer )
    //
    //Mithril would then use this class to preprocess received data
    //
    //But in this example we will use Kendo-Framework's DataSource functionality to preprocess JSON data
    //More info here: http://docs.telerik.com/kendo-ui/api/javascript/data/datasource
    //
    app.Customers = function () {
        return m.request(
            {
                method: "GET",
                url: 'http://services.odata.org/Northwind/Northwind.svc/Customers?$format=json',
            });
    };

    app.Firebase = function () {
        return new Firebase(app.FIREBASE_URL);
    };

}(window, Mithril));