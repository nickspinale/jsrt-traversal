// Given a root object, run do a depth-first traversal on it, passing each of
// its nodes to f. If f returns a function, the path of the node relative to
// root is calculated and passed to it. If f or the function returned by f
// return false, the traversal is stopped.
function traverse(root, f) {

    var visited = new Map();
    var props = new Map();

    function makePath(node) {
        var curr = node;
        var path = [];
        while (curr != root) {
            path.push(props.get(curr));
            curr = visited.get(curr);
        }
        return path;
    }

    var q = new Queue();
    q.enqueue(root);

    while (!q.isEmpty()) {
        var node = q.dequeue();
        var cont = f(node);
        if (typeof cont == 'function') {
            cont = cont(makePath(node));
        }
        switch (cont) {
            case 'stop':
                return;
            case 'continue':
                if (typeof node == 'object' && typeof node.hasOwnProperty == 'function') {
                    for (var property in node) {
                        if (node.hasOwnProperty(property)) {
                            if (!visited.has(node[property])) {
                                visited.set(node[property], node);
                                props.set(node[property], property);
                                q.enqueue(node[property]);
                            }
                        }
                    }
                }
            case 'skip':
                break;
            default:
                throw '[TRAVERSAL ERROR] continuation returned: ' + cont
        }
    }
}


// Format a list of object path components to the usual dot notation.
function formatPath(path) {
    var str = '';
    var i = path.length;
    while (i-- > 0) {
        var c = path[i].charAt(0);
        if ('0' <= c && c <= '9') {
            str += '[' + path[i] + ']';
        } else {
            str += '.' + path[i];
        }
    }
    return str;
}


// Send the given string to server.py, which will store it at the given path,
// relative to server.py's base directory.
function toFile(path, data) {

    var form = document.createElement('form');
    form.setAttribute('target', '_blank');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', 'http://localhost:13337/' + path);
    var field = document.createElement("input");
    field.setAttribute('type', 'hidden');
    field.setAttribute('name', 'data');
    field.setAttribute('value', encodeURIComponent(data));
    form.appendChild(field);
    document.body.appendChild(form);
    form.submit();

    // // [alternative approach] self signed cert for localhost:
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'https://localhost:13337/' + path, false);
    // xhr.send(data);

}


// Queue for depth-first search
function Queue() {

    var queue = [];
    var offset = 0;

    this.isEmpty = function() {
        return queue.length == 0;
    }

    this.enqueue = function(item) {
      queue.push(item);
    }

    this.dequeue = function() {
        if (queue.length == 0) {
            return undefined;
        }
        var item = queue[offset++];
        if (2 * offset >= queue.length){
            queue = queue.slice(offset);
            offset = 0;
        }
        return item;
    }
}
