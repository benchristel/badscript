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

function get(n) {
  return function(array) {
    return array[n]
  }
}

}

Root = _ exp:Expression _
{ return exp }

Expression
  = first:ConditionedExpression conditional:(Space Conditional)?
{
  if (conditional === null) {
    return first
  }

  var value, alternative
  if (conditional[1].negated) {
    value = conditional[1].alternative
    alternative = first
  } else {
    value = first
    alternative = conditional[1].alternative
  }

  return {
    type: 'Expression',
    value: value,
    condition:   conditional[1].condition,
    alternative: alternative
  }
}

ConditionedExpression
  = CaseExpression
  / first:PipeableExpression rest:(Space PipeableExpression)*
{
  if (rest.length == 0) {
    return first
  }

  return {
    type: 'ConditionedExpression',
    pipeableExpressions: [first].concat(rest.map(get(1)))
  }
}
  / String
  / Number

PipeableExpression
  = head:InvocableExpression tail:(_ Invocation)*
{
  if (tail.length == 0) {
    return head
  }

  return {
    type: 'PipeableExpression',
    invocable: head,
    invocations: tail.map(get(1))
  }
}

InvocableExpression
  = Identifier
  / Function

Invocation
  = '(' first:Expression? rest:(',' _ Expression)* ')'
{
  var firstArg = (first == null ? [] : [first])

  return {
    type: 'Invocation',
    arguments: firstArg.concat(rest.map(function(x) { return x[2] }))
  }
}

Identifier 'identifier' = !ReservedWord name: ([A-Za-z_][A-Za-z0-9_]*)
{
  return {
    type: 'Identifier',
    name: flatten(name).join('')
  }
}

ReservedWord
  = "if"
  / "but"
  / "when"
  / "else"
  / "then"

Number
  = digits:([0-9] / [1-9] Number)
{
  return {
    type: 'Number',
    value: flatten(digits).join('')
  }
}

/**
 * CONDITIONALS
 *
 */

Conditional
  = c:IfElseConditional { return c }
  / c:ButIfThenConditional { return c }

IfElseConditional
  = 'if' Space condition:Expression Space 'else' Space alternative:Expression
{
  return {
    condition: condition,
    alternative: alternative,
    negated: false
  }
}

ButIfThenConditional
  = 'but' Space 'if' Space condition:Expression Space 'then' Space alternative:Expression
{
  return {
    condition: condition,
    alternative: alternative,
    negated: true
  }
}

CaseExpression
  = cases:CaseList Space elseCase:ElseCase
{
  return {
    type: 'CaseExpression',
    cases: cases,
    elseValue: elseCase
  }
}

CaseList
  = first:Case rest:(Space Case)*
{
  return [first].concat(rest.map(function(x) { return x[1] }))
}

Case
  = 'when' Space condition:Expression Space 'then' Space value:Expression
{
  return {
    condition: condition,
    value: value
  }
}

ElseCase
  = 'else' Space value:Expression
{
  return value
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
  = '{' _ maybeParams: ParameterList? _ body: FunctionBody _ '}'
{
  var params = maybeParams ? maybeParams : []
  return {
    type: 'Function',
    parameters: params,
    body: body
  }
}

CurryFunction
  = params: ParameterList _ body: FunctionBody
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
  = expr:Expression { return expr }
  / CurryFunction

_ "whitespace"
  = [ \t\n\r]*

Space "whitespace"
  = [ \t\n\r]+
