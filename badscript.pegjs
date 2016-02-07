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

Expression
  = Identifier
  / Function
  / Number

Identifier = name: ([A-Za-z_][A-Za-z0-9_]*)
{
  return {
    type: 'Identifier',
    name: flatten(name).join('')
  }
}

Number
  = digits:([0-9] / [1-9] Number)
{
  return {
    type: 'Number',
    value: flatten(digits).join('')
  }
}

/**
 * STRINGS
 *
 */

String
  = '"' parts: (DoubleQuoteStringCharSequence / Interpolation)* '"'
{
  return {
    type: 'String',
    parts: parts,
    quote: '"'
  }
}
  / "'" parts: (SingleQuoteStringCharSequence / Interpolation)* "'"
{
  return {
    type: 'String',
    parts: parts,
    quote: "'"
  }
}

DoubleQuoteStringCharSequence 'string data' = chars: DoubleQuoteStringChar+
{
  return {
    type: 'StringData',
    value: chars.join(''),
    quote: '"'
  }
}

SingleQuoteStringCharSequence 'string data' = chars: SingleQuoteStringChar+
{
  return {
    type: 'StringData',
    value: chars.join(''),
    quote: "'"
  }
}

DoubleQuoteStringChar 'a string character'
  = !('"' / '\\') char: .
    {
    return char
    }
  / char: EscapeSequence
    {
    return char
    }

SingleQuoteStringChar 'a string character'
  = !("'" / '\\') char: .
    {
    return char
    }
  / char: EscapeSequence
    {
    return char
    }

EscapeSequence
  = '\\n'
  / '\\"'
  / "\\'"

Interpolation
  = '\\(' expr: Expression ')'
    {
    return expr
    }

/**
 * FUNCTIONS
 *
 */

Function
  = maybeParams: ParameterList? _ body: FunctionBody
{
  var params = maybeParams ? maybeParams : []
  return {
    type: 'Function',
    parameters: params,
    body: body
  }
}
  / params: ParameterList _ body: Function
{
  return {
    type: 'Function',
    parameters: params,
    body: body
  }
}

ParameterList
  = '(' params:Parameters? ')'
{
  return params
}

Parameters
  = first:Parameter rest:(',' _ Parameter)*
{
  return [first].concat(rest.map(function(i) {return i[2]}))
}

Parameter = i:Identifier defaultValue:(_ ':' _ Expression)?
{
  return {
    type: 'Parameter',
    name: i.name,
    value: defaultValue ? defaultValue[3] : null
  }
}

FunctionBody
  = '{' _ expr:Expression _ '}' { return expr }

_ "whitespace"
  = [ \t\n\r]*
