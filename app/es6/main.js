// Lijkt wat op C#
// Met gulp es6 kunnen we transpilen
class App {
    constructor() {
        console.log('HALLO CONSTRUCTOR VAN DE APP');
    }

    // Arrow function, verkorte notatie van een klassieke function
    // Eerst krijgen we een error
    // We kunnen dit oplossen met het toevoegen van een .babelrc 
    // en daar zetten we in json formaat dingen in
    init = () => {
        console.log('Init method');
    }
};