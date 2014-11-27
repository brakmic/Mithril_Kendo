Mithril & Kendo 
===============

This is a demo webapp that combines Mithril, Kendo UI, ASP.NET & Firebase.

* Mithril:   <a href="http://lhorie.github.io/mithril" target="_blank">Github Homepage</a>
* Kendo UI: <a href="http://www.telerik.com/kendo-ui1" target="_blank">Telerik Homepage</a>
* Firebase: <a href="https://www.firebase.com" target="_blank">Firebase</a>
* Northwind Service: <a href="http://services.odata.org/Northwind/Northwind.svc/?$format=json" target="_blank">Service JSON</a>

Please note that Kendo Grid belongs to the "Professional" version of Kendo UI and therefore needs a proper license to be used.
Therefore *I'm not providing the copyrighted scripts/styles to avoid violation of Telerik's license terms*.

But there's a 30 day trial available: <a href="http://www.telerik.com/download/kendo-ui" target="_blank">Kendo UI Trial License</a>

The Kendo-Scripts should go into *Scripts/kendo* directory and CSS-files into *Content/kendo*.
Or adjust the Bundles in *App_Start/BundleConfig.js*

This app served me to test Mithril's capabilities and how to combine it with some other frameworks.
I recommend to read <a href="http://lhorie.github.io/mithril/integration.html" target="_blank">this introduction</a> on integrating Mithril with other libraries.  

The app itself is a "no-brainer" and the most complex part actually is the configuration of the Kendo-Grid in *Scripts/app/demo.view.js*.

Nevertheless, I tried to make this demo app somewhat "realistic" and added not only one grid-template but also a nested template for detail grid-views. 
Using nested templates in Kendo UI is rather problematic because you can't simply select elements by their "ids". More info on this peculiarity <a href="http://blog.falafel.com/nested-templates-kendo-ui/" target="_blank">here</a>.

This demo also supports retrieval of JSON-data from Firebase. You have to create a (free) Firebase account to play around with it. 
Look into *demo.model.js* for more information.

Regarding the Mithril framework I can only say: **It's a great little tool!** The emphasis is on **great** :)

But I'm still not sure if the Mithril components in this app are *correct* and completely following certain guidelines. 

I discovered Mithril just a few days ago.
So, if you find any problematic parts, please let me know.


***This is the Kendo Grid with some Northwind Test-Data.***

![Kendo Grid](http://f33.imgup.net/mithril8f2b.png "KendoGrid")

**Firebase**

The current Firebase integration shows a simple "three-way" data-binding between the view, the model and the database hosted at Firebase.com. If you change the value on Firebase, for example by sending a POST request
via <a href="http://curl.haxx.se/" target="_blank">cURL</a>, a respective event "child_added" will be fired and the app will change the value in the textbox.

Here I'm sending a POST message to my Firebase-server to store it under the /messages-path.

    echo {"id":"1","user":"harris","msg":"Hello world!"} | curl https://torid-heat-7688.firebaseio.com/messages.json -H "Accept: application/json" -H "Content-Type: application/json" -d @-

You can also change an existing value or create a new entry in Firebase by using the buttons. 

<img src="http://j78.imgup.net/firebase6850.png"/>


More info on data handling, persisting and retrieval: <a href="https://www.firebase.com/docs/web/guide/setup.html">Firebase Guide</a>

**License**
---------
**MIT**