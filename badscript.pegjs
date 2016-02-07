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

Expression = value: Identifier
  {
  return {
    type: 'Expression',
    value: value
    }
  }

Identifier = name: ([A-Za-z_][A-Za-z0-9_]*)
{
  return {
    type: 'Identifier',
    name: flatten(name).join('')
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
