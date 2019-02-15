import printMe from './print'
function component() {
    var element = document.createElement('div');

    element.innerHTML = 'Hello' + ' webpack'
    printMe()
    return element;
}

document.body.appendChild(component());