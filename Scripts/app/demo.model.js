(function (global, m) {

    var app = global.app = global.app || {};

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
    
    //init the view model
    app.vm = {};
    app.vm.init = function () {
        this.customers = new app.Customers();
    };

}(window, Mithril));