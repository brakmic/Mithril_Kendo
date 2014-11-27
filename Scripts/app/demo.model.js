(function (global, m) {
    'use strict';
    var app = global.app = global.app || {};
    
    //define the view model
    app.vm = new function() {
        var vm = {};
        vm.init = function () {
            console.log('initializing view-model');
            vm.customers = app.Customers();
            vm.firebase = app.Firebase();
            vm.currentFirebaseMsgId = null;
            vm.currentSnapshot = null;
            vm.messages = vm.firebase.child('messages');
            vm.firebaseValue = m.prop('A default Firebase value');

            vm.updateMessage = function (data) {
                m.startComputation();
                vm.firebaseValue(data);
                m.endComputation();
                console.log('Updating Textbox with: ' + data);
            };

            vm.updateValueInFirebase = function () {
                if (!vm.currentSnapshot) return;
                vm.currentSnapshot.ref().update({
                    msg: vm.firebaseValue()
                });

            };

            vm.createEntryInFirebase = function () {
               if (!vm.currentSnapshot) return;
               vm.messages.push({
                    id: Math.floor(Math.random()*11),
                    user: 'Harris',
                    msg: vm.firebaseValue()
                }, vm.onComplete);
            };

            vm.onComplete = function (error) {
                if (error) {
                    console.log('error: ' + error);
                }
            };

            //insert new firebase data into textbox by using mithrils rendering capabilities
            //because we're calling stuff outside of Mithril (Firebase) we have to explicitely 
            //call Mithril's start*-/EndComputation
            vm.updateMessage = function (data) {
                m.startComputation();
                vm.firebaseValue(data);
                m.endComputation();
                console.log('Updating Textbox with: ' + data);
            };

            vm.messages.on("child_added", function (snapshot) {
                console.log('Got new data from Firebase: ' + JSON.stringify(snapshot.val()) + ', snapshot: ' + snapshot.key());
                vm.currentSnapshot = snapshot;
                vm.updateMessage(snapshot.val().msg);
                vm.currentFirebaseMsgId = snapshot.key();
            });

            vm.messages.on('child_changed', function (snapshot) {
                console.log('Firebase entry changed: ' + snapshot.val().msg);
            });

            //wire up Firebase connection
            app.fireAuth(vm.firebase, 'USER', 'PWD');
            
            //to retrieve JSON data directly from Firebase add '.json' to the URL like in the example below
            //more info on filtering here: https://www.firebase.com/docs/web/guide/retrieving-data.html#section-queries
            vm.firebaseJsonUrl = app.FIREBASE_URL + '/messages.json?limitToFirst=10&orderBy=%22$key%22';
        };
        return vm;
    };

}(window, Mithril));
