import { file, parse } from './globals.js'
console.log(file);
console.log(parse);
import a from './a'
console.log(a);

function component() {
  var element = document.createElement('div');

  element.innerHTML = join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');
  alert('Hmmm, this probably isn\'t a great idea...')
  return element;
}

document.body.appendChild(component());