'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Lijkt wat op C#
// Met gulp es6 kunnen we transpilen
var App = function App() {
    _classCallCheck(this, App);

    this.init = function () {
        console.log('Init method');
    };

    console.log('HALLO CONSTRUCTOR VAN DE APP');
}

// Arrow function, verkorte notatie van een klassieke function
// Eerst krijgen we een error
// We kunnen dit oplossen met het toevoegen van een .babelrc
;

;