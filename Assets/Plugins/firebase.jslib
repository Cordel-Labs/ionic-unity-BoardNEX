mergeInto(LibraryManager.library, {

    GetJSON: function (path, name, callback, fallback){
        var parsedPath = Pointer_stringify(path);
        var parsedName = Pointer_stringify(name);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try{
            firebase.database().ref(parsedPath).once('value').then(function(snapshot){
                console.log(JSON.stringify(snapshot.val()));
                console.log(parsedName);
                console.log(parsedCallback);
                window.unityInstance.SendMessage(parsedName, parsedCallback, JSON.stringify(snapshot.val()));
            });
        } catch (err){
            window.unityInstance.SendMessage(parsedName, parsedFallback, err.message);
        }
    },

    PostJSON: function (path, value, name, callback, fallback){
        var parsedPath = Pointer_stringify(path);
        var parsedValue = Pointer_stringify(value);
        var parsedName = Pointer_stringify(name);
        var parsedCallback = Pointer_stringify(callback);
        var parsedFallback = Pointer_stringify(fallback);

        try{
            firebase.database().ref(parsedPath).set(JSON.parse(parsedValue)).then(function(unused) {
                window.unityInstance.SendMessage(parsedName, parsedCallback, "Success");
            });
        } catch (err){
            window.unityInstance.SendMessage(parsedName, parsedFallback, JSON.stringify(err, Object.getOwnPropertyNames(err)));
        }
    },

    WindowMessage: function(message){
        var parsedMessage = Pointer_stringify(message);
        window.postMessage(parsedMessage);
    }
});