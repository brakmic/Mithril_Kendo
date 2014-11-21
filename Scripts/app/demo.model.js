(function (global, m) {

    var app = global.app = global.app || {};

    //predefine a mithril-based model for json data we're going to receive
    var Customer = function (jsonData) {
        var data = jsonData.value[0];
        this.id = m.prop(jsonData.CustomerID);
        this.name = m.prop(jsonData.ContactName);
        this.company = m.prop(jsonData.CompanyName);
        this.address = m.prop(jsonData.Address);
        this.city = m.prop(jsonData.City);
        this.postalCode = m.prop(jsonData.PostalCode);
        this.country = m.prop(jsonData.Country);
        this.phone = m.prop(jsonData.Phone);
    };

    app.Customers = function () {
        return m.request(
            {
                method: "GET",
                url: 'http://services.odata.org/Northwind/Northwind.svc/Customers?$format=json',
                //type: Customer //cast the received json payload to "Customer"
            });
    };

    //init the view model
    app.vm = {};
    app.vm.init = function () {
        this.customers = new app.Customers();
    };

}(window, Mithril));