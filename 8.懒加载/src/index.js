import './style.css'
import _ from 'lodash';

function component() {
  var element = document.createElement('div');
  var button = document.createElement('button');
  var br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.appendChild(br);
  element.appendChild(button);


  button.onclick = function (e) {
    import('./print').then((Module)=>{
      let print = Module.default
      print()
    })
  }
  return element;
}

document.body.appendChild(component());