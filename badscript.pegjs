{

function flatten(array) {
  var flat = [], i
  for (i = 0; i < array.length; i++) {
    if (isArray(array[i])) {
      flat = flat.concat(flatten(array[i]))
    } else {
      flat.push(array[i])
    }
  }
  return flat
}

function isArray(thing) {
  return Object.prototype.toString.call(thing) === '[object Array]'
}

}


Identifier = name: ([A-Za-z_][A-Za-z0-9_]*)
{
  return {
    type: 'Identifier',
    name: flatten(name).join('')
  }
}
