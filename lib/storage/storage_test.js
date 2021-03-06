/*
Tests for storage modules.
This file currently test simple_storage.js and mongo_storage.js.

If you build a new storage module,
you must add it to this test file before your PR will be considered.
How to add it to this test file:

Add the following to the bottom of this file:

// Test <your_storage_module>
<your_storage_module> = require('./<your_storage_module>.js')(<appropriate config object for your storage module>);
check(<your_storage_module>.users);
check(<your_storage_module>.channels);
check(<your_storage_module>.teams);
*/

var test = require('unit.js');

testObj0 = {id: 'TEST0', foo: 'bar0'};
testObj1 = {id: 'TEST1', foo: 'bar1'};

var testStorageMethod = function(storageMethod) {
    storageMethod.save(testObj0, function(err) {
        test.assert(!err);
        storageMethod.save(testObj1, function(err) {
            test.assert(!err);
            storageMethod.get(testObj0.id, function(err, data) {
                test.assert(!err);
                console.log(data);
                test.assert(data.foo === testObj0.foo);
            });
            storageMethod.all(function(err, data) {
                test.assert(!err);
                console.log(data);
                test.assert(
                    data[0].foo === testObj0.foo && data[1].foo === testObj1.foo ||
                    data[0].foo === testObj1.foo && data[1].foo === testObj0.foo
                );
            });
        });
    });
};

console.log('If no asserts failed then the test has passed!');
var testMethods = function (storage) {
    fns = ["users", "channels", "teams"];
    for (var i = 0; i < 3; i++) {
        testStorageMethod(storage[fns[i]]);
    };
}

// Test simple_storage
var simple_storage = require('./simple_storage.js')();
testMethods(simple_storage)

/*
// Test redis_storage
var redis_storage = require('./redis_storage.js')({
    url: 'redis://redistogo:d175f29259bd73e442eefcaeff8e78aa@tarpon.redistogo.com:11895/'
});
testMethods(redis_storage)

// Test firebase_storage
var firebase_storage = require('./firebase_storage.js')({
    firebase_uri: 'https://botkit-example.firebaseio.com'
});
testMethods(firebase_storage)
*/
// Test mongo_storage
var mongo_storage = require('./mongo_storage.js')({
    url: 'XXX_MONGO_URL'
});
testMethods(mongo_storage);
