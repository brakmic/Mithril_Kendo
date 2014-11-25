(function (global, m) {

    var app = global.app = global.app || {},
        FIREBASE_URL = 'YOUR_FIREBASE_SERVER',
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
        return new Firebase(FIREBASE_URL);
    };
    
    //define the view model
    app.vm = {};
    app.vm.updateFirebase = function () {
        //TODO implement an update procedure
        console.log('Update firebase called.');
    };

    //insert new firebase data into textbox by using mithrils rendering capabilities
    //because we're calling stuff outside of Mithril (Firebase) we have to explicitely 
    //call Mithril's start*-/EndComputation
    app.vm.updateFirebaseMessage = function (data) {
        m.startComputation();
        app.vm.firebaseValue(data);
        m.endComputation();
        console.log('Updating Textbox with: ' + data);
    };
    //init model
    app.vm.init = function () {
        this.customers = new app.Customers();
        this.firebase = new app.Firebase();

        //init Mithril-style property to get dynamic view updates
        this.firebaseValue = m.prop('A default Firebase value');

        //get the child path of current Firebase root (some sub-structure like "messages", "users" etc.)
        this.messages = this.firebase.child('messages');

        //register to child-added events of Firebase
        this.messages.on("child_added", function (snapshot) {
            console.log('Got new data from Firebase: ' + JSON.stringify(snapshot.val()));
            app.vm.updateFirebaseMessage(snapshot.val().msg);
        });

        //wire up Firebase connection
        fireAuth(this.firebase, 'USER_NAME', 'PASSWORD');

        //to retrieve JSON data directly from Firebase add '.json' to the URL like in the example below
        //more info on filtering here: https://www.firebase.com/docs/web/guide/retrieving-data.html#section-queries
        this.firebaseJsonUrl = FIREBASE_URL + '/messages.json?limitToFirst=10&orderBy=%22$key%22';
    };

}(window, Mithril));
