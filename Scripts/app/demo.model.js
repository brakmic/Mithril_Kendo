(function (global, m) {

    var app = global.app = global.app || {},
        FIREBASE_URL = 'YOUR_FIREBASE_SERVER_URL',
        //authenticate Firebase services
        fireAuth = function (fire, user, pwd) {
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
    
    //init the view model
    app.vm = {};
    app.vm.init = function () {
        this.customers = new app.Customers();
        this.firebase = new app.Firebase();
        fireAuth(this.firebase,'USER-EMAIL', 'PASSWORD');
        //to retrieve JSON data directly from Firebase DB add '.json' to the URL like in the example below
        //more info on filtering here: https://www.firebase.com/docs/web/guide/retrieving-data.html#section-queries
        this.firebaseJsonUrl = app.FIREBASE_URL + '/.json?limitToFirst=10&orderBy=%22$key%22';
    };

}(window, Mithril));