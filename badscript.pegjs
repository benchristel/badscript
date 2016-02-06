
Identifier = name: ([A-Za-z_][A-Za-z0-9_]*)
{
  return {
    type: 'Identifier',
    name: [name[0]].concat(name[1]).join('')
  }
}
