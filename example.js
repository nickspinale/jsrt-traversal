// Open the target web page. In this case, that is a google sheet containing a
// bus schedule with google maps links. This particular sheet is protected, so
// editing and copying are prohibited. Furthermore, the sheet is rendered on a
// canvas, so there is no easy way to get the data from it.  Our goal is to
// extract the stop names and coordinates, to be able to put them on map.

// Check out ./traverse.js, and source it in the open page using the console.

// === RECON ===

// Search for a string seen in document.
traverse(window, function(node) {
    if (typeof node == 'string' && node.includes('N. Wolfe @ Pruneridge NB')) {
        console.log(node);
        return function(path) {
            try {
                console.log(formatPath(path));
            } catch(err) {
                console.log(err);
                console.log(path);
            }
            return true;
        }
    }
    return true;
});

// Looks like we could try and find the spreadsheet itself.
traverse(window, function(node) {
    if (typeof node == 'object' && node != null && node.length == 1000) {
        return function(path) {
            try {
                console.log(formatPath(path));
            } catch(err) {
                console.log(err);
                console.log(path);
            }
            return true;
        }
    }
    return true;
});

// Uh oh. That's not gonna work. Let's look for the links we're interested in.
traverse(window, function(node) {
    if (typeof node == 'string' && node.includes('www.google.com/maps/place')) {
        console.log(node);
    }
    return true;
});

// Hyperlinked text is formatted in a weird way in certain strings, giving us
// both the text and link. Let's use that to extract all the relevant data.

// === EXTRACTION ===

var regex = /LShttps:\/\/www.google.com\/maps\/place\/(-?[0-9]*\.[0-9]*),(-?[0-9]*\.[0-9]*)]]LS(.*?)]]/;
var stops = [];

traverse(window, function(node) {
    if (typeof node == 'string') {
        var match = node.match(regex);
        if  (match != null) {
            stops.push([match[1], match[2], match[3]]);
        }
    }
    return true;
});

// We're extracting enough data that manually copying from the console to the
// clipboard wouldn't work. So, fire up ./server.py, optionally providing it
// with a directory to store the files it's sent, and send it the data.
toFile('stops.json', JSON.stringify(stops));

// ./stops.json now contains the data we wanted:
// A list of 283 lists of the form [latitude, longitude, stop name]
