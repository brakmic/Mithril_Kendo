(function (global, m) {

    var app = global.app = global.app || {};
    //create a new element and its sub-elements (detail-grids, listviews etc.)
    function initKendoGrid(element, isInitialized, context) {
        if (isInitialized) return; //do this only once

        //show info about the selected row (this snippet was taken from the Kendo Grid demo page http://demos.telerik.com/kendo-ui/grid/index)
        function onChange(arg) {
            var selected = $.map(this.select(), function (item) {
                return $(item).text();
            });
            if (selected) {
                console.log("Selected: " + selected.length + " item(s), [" + selected.join(", ") + "]");
            }
        }
        //here we do some extra processing for each customer order-details view (the template is in Views/Home/_Home.cshtml)
        function detailInit(e) {
            if (e) {
                console.log('customerId: ' + e.data.id);
                var detailRow = e.detailRow,
                    id = e.data.id,
                    tabStrip = $('.mithril-tabstrip:not(.modified)'), 
                    grid = $('.mithril-detail-grid:not(.modified)'), 
                    listView = $('.mithril-customer-address:not(.modified)'); 
                //To prevent "updating" of already processed detail-grids we add the class "modified" to every detail-grid, 
                //tabStrip & listView widget.
                //Without this setting the current widgets would overwrite all others because we can only 
                //select "classes" and not "ids". 
                //More info on this problem here: http://blog.falafel.com/nested-templates-kendo-ui/
                grid.addClass('modified');
                tabStrip.addClass('modified');
                listView.addClass('modified');

                tabStrip.kendoTabStrip();
                //show contact data of the selected customer
                listView.kendoListView({
                    template: '<li class=\"mithril-contact-entry\">Street: ${Address}<br/>ZIP: ${PostalCode}<br/>City: ${City}<br/>Country: ${Country}</li>',
                    dataSource: {
                        data: [{
                            Address: e.data.address,
                            PostalCode: e.data.postalCode,
                            City: e.data.city,
                            Country: e.data.country
                        }]
                    }
                });

                //initialize the detail grid (the details will be separately received by an extra call. 
                //Of course, we could do it via Mithrils 'm.request' method too.)
                grid.kendoGrid({
                    dataSource: {
                        type: 'json',
                        transport: {
                            read: 'http://services.odata.org/Northwind/Northwind.svc/Orders?$format=json'
                        },
                        serverPaging: false,
                        serverSorting: false,
                        serverFiltering: false,
                        pageSize: 10,
                        filter: { field: 'customerId', operator: 'eq', value: id },
                        schema: {
                            model: {
                                id: 'customerId',
                                fields: {
                                    customerId: { editable: false, nullable: false },
                                    productName: { editable: false, nullable: false, type: 'string' },
                                    orderDate: { editable: true, nullable: false, type: 'string' },
                                    requiredDate: { editable: true, nullable: false, type: 'string' },
                                    shippedDate: { editable: true, nullable: true, type: 'string' },
                                    shipVia: { editable: true, nullable: true, type: 'string' },
                                    freight: { editable: true, nullable: true, type: 'string' },
                                    shipName: { editable: true, nullable: true, type: 'string' },
                                    shipAddress: { editable: true, nullable: true, type: 'string' },
                                    shipCity: { editable: true, nullable: true, type: 'string' },
                                    shipRegion: { editable: true, nullable: true, type: 'string' },
                                    shipPostalCode: { editable: true, nullable: true, type: 'string' },
                                    shipCountry: { editable: true, nullable: true, type: 'string' }
                                }
                            },
                            parse: function (response) {
                                var orders = [];
                                for (var i = 0; i < response.value.length; i++) {
                                    var data = response.value[i] ? response.value[i] : null,
                                    order = {
                                        id: data.OrderID,
                                        customerId: data.CustomerID,
                                        orderDate: data.OrderDate ? kendo.toString(new Date(data.OrderDate), "d") : null,
                                        requiredDate: data.RequiredDate ? kendo.toString(new Date(data.RequiredDate), "d") : null,
                                        shippedDate: data.ShippedDate ? kendo.toString(new Date(data.ShippedDate), "d") : null,
                                        shipVia: data.ShipVia,
                                        freight: data.Freight,
                                        shipName: data.ShipName,
                                        shipAddress: data.ShipAddress,
                                        shipCity: data.ShipCity,
                                        shipRegion: data.ShipRegion,
                                        shipPostalCode: data.ShipPostalCode,
                                        shipCountry: data.ShipCountry
                                    };
                                    orders.push(order);
                                };
                                return orders;
                            }
                        }
                    },
                    sortable: true,
                    pageable: true,
                    sizable: true,
                    selectable: true,
                    scrollable: true,
                    editable: false,
                    columns: [
                    //{ field: 'id', title: 'Order ID' },
                    { field: 'orderDate', title: 'Order Date' },
                    { field: 'requiredDate', title: 'Required Date' },
                    { field: 'shippedDate', title: 'Shipped Date' },
                    //{ field: 'shipVia', title: 'Ship Via' },
                    //{ field: 'freight', title: 'Freight' },
                    //{ field: 'shipName', title: 'Shipping Name' },
                    { field: 'shipAddress', title: 'Address' },
                    { field: 'shipCity', title: 'City' },
                    //{ field: 'shipRegion', title: 'Region' },
                    { field: 'shipPostalCode', title: 'Postal Code' },
                    { field: 'shipCountry', title: 'Country' },
                    ]
                });
            }
        }
        //prepare options for the main grid
        var options = {
            dataSource: {
                data: app.vm.customers(), //get data via Mithril's "m.request" (http://lhorie.github.io/mithril/mithril.request.html)
                //alternatively, we could call the service by using pure Kendo functionality
                //for example:
                //(http://docs.telerik.com/kendo-ui/api/javascript/data/datasource)
                //dataSource: {
                //              transport: {
                //                             read: {
                //                                      url: 'service_url',
                //                                      dataType: 'json'  //or 'jsonp' in case of a cross-domain call
                //                              }
                //                      }
                //           }
                pageSize: 5,
                serverPaging: false,
                serverSorting: false,
                schema: {
                    model: { //this will be the model for the grid
                        id: 'id',
                        fields: {
                            id: { editable: false, nullable: false },
                            name: { editable: false, nullable: true, type: 'string' },
                            company: { editable: false, nullable: true, type: 'string' },
                            address: { editable: false, nullable: true, type: 'string' },
                            city: { editable: true, nullable: true, type: 'string' },
                            postalCode: { editable: true, nullable: true, type: 'string' },
                            country: { editable: false, nullable: true, type: 'string' },
                            phone: { editable: true, nullable: true, type: 'string' },
                        }
                    },
                    parse: function (response) { //here we process the received data and adjust it to our internal format
                        var customers = [];
                        for (var i = 0; i < response.value.length; i++) {
                        var data = response.value[i] ? response.value[i] : null,
                        customer = {
                                id: data.CustomerID,
                                name: data.CompanyName,
                                address: data.Address,
                                city: data.City,
                                postalCode: data.PostalCode,
                                country: data.Country,
                                phone: data.Phone
                            }
                            customers.push(customer);
                        };
                        console.log(customers);
                        return customers;
                    }
                }
            },
            sortable: true,
            pageable: true,
            groupable:true,
            sizable: true,
            selectable: true,
            scrollable: true,
            filterable: true,
            change: onChange,
            //a template for order details
            //this will get called after we open the detail page (and only once per customer)
            detailTemplate: kendo.template($(".mithril-template").html()),
            detailInit: detailInit, //here we do extra processing of the template for each customer 
            editable: {
                confirmation: function (e) {
                    return 'Do you really want to delete the customer?';
                },
                cancelDelete: 'No',
                confirmDelete: 'Yes',
                mode: 'inline'
            },
            columns: [
                    {
                        field: 'id',
                        title: 'ID'
                    },
                    {
                        field: 'name',
                        title: 'Customer'
                    },
                    {
                        field: 'company',
                        title: 'Company'
                    },
                    {
                        field: 'address',
                        title: 'Address'
                    },
                    {
                        field: 'city',
                        title: 'City'
                    },
                    {
                        field: 'postalCode',
                        title: 'Postal Code'
                    },
                    {
                        field: 'country',
                        title: 'Country'
                    },
                    {
                        field: 'phone',
                        title: 'Phone'
                    },
                    {
                        command: [
                            { name: 'edit', text: { edit: 'Edit', cancel: 'Cancel', update: 'OK' } },
                            { name: 'destroy', text: 'Delete' },
                        ],
                        title: '&nbsp;',
                        width: '220px'
                    }
            ]
        }
        //inject Kendo Grid with options set above
        $(document).ready(function () {
            var grid = $('#mithril-grid-demo').kendoGrid(options);
        });
    }
    //Create a new HTML element with Mithril
    //
    //One alternative to writing pure JavaScript templates could be 
    //the port of React's JSX called MSX: https://github.com/insin/msx
    //****************************************************************************************
    //In "initKendoGrid" we process everything we need to manipulate the grid-structure 
    //that relies on classes that do not belong to Mithril.
    //Kendo Grid knows nothing about Mithril and vice-versa and therefore we need some 
    //extra functionality to process templates, detail vies etc.
    //More info regarding the property "config" here: http://lhorie.github.io/mithril/mithril.html#persisting-config-data
    app.view = function (ctrl) {
        return m('div', [
                          m('div', { id: 'mithril-grid-demo', 'class': 'mithril-grid', config: initKendoGrid }),
                          m('div', {'class': 'row'}, [
                             m('div', { 'class': 'col-lg-12' },
                             m('div', { id: 'firebase-app', 'class': 'well' },
                              [m('label', { 'for': 'firebase-value', }, 'Message from Firebase'),
                                m('input[type=text]', { id: 'firebase-value', 'class': 'firebase-value input-group', 'value': app.vm.firebaseValue(), 'onkeyup': m.withAttr('value', app.vm.updateMessage) }),
                                m('div', { 'class': 'btn-toolbar' }, [
                                    m('input[type=button]', { id: 'firebase-value-create', 'class': 'btn btn-success', 'value': 'Create', 'onclick': app.vm.createEntryInFirebase }),
                                    m('input[type=button]', { id: 'firebase-value-update', 'class': 'btn btn-success', 'value': 'Update', 'onclick': app.vm.updateValueInFirebase })
                                ])
                                
                  ])
              )]
            )
        ]);
    };

}(window, Mithril));