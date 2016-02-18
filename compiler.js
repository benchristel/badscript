module.exports = (function() {
    "use strict";

    return {
        compile: compile
    }

    function compileWithBinding(nameBinding) {
        return function(node) {
            return compile(node, nameBinding)
        }
    }

    function compile(node, nameBinding) {
        if (nameBinding === undefined) {
            nameBinding = {}
        }

        switch (node.type) {
            case 'String':
                return compileString(node, nameBinding)
            case 'StringData':
                return compileStringData(node, nameBinding)
            case 'Expression':
                return compileExpression(node, nameBinding)
            case 'ConditionedExpression':
                return compileConditionedExpression(node, nameBinding)
            case 'CaseExpression':
                return compileCaseExpression(node, nameBinding)
            case 'PipeableExpression':
                return compilePipeableExpression(node, nameBinding)
            case 'Invocation':
                return compileInvocation(node, nameBinding)
            case 'Identifier':
                return compileIdentifier(node, nameBinding)
            case 'Function':
                return compileFunction(node, nameBinding)
            case 'Number':
                return compileNumber(node, nameBinding)
        }
        throw "unidentified node type for compilation: "+node.type
    }

    function compileString(node, nameBinding) {
        return node.parts.map(compileWithBinding(nameBinding)).join('+')
    }

    function compileStringData(node) {
        return node.quote + node.value + node.quote
    }

    function compileExpression(node, nameBinding) {
        return '('+compile(node.condition, nameBinding)+
               ')?('+compile(node.value, nameBinding)+
               '):('+compile(node.alternative, nameBinding)+')'
    }

    function compileCaseExpression(node, nameBinding) {
        return reverse(node.cases).reduce(function(elseValue, aCase) {
            return "("+compile(aCase.condition, nameBinding)+")?("+compile(aCase.value, nameBinding)+"):("+elseValue+")"
        }, compile(node.elseValue, nameBinding))
    }

    function compileConditionedExpression(node, nameBinding) {
        // translate pipes, e.g. a b c, into function composition, e.g.
        // c(b(a))

        var expressions = node.pipeableExpressions.slice().reverse()

        return expressions.map(compileWithBinding(nameBinding)).join('(') + repeatString(')', expressions.length - 1)
    }

    function compilePipeableExpression(node, nameBinding) {
        return compile(node.invocable, nameBinding) + node.invocations.map(compileWithBinding(nameBinding)).join('')
    }

    function compileInvocation(node, nameBinding) {
        return '(' + node.arguments.map(compileWithBinding(nameBinding)).join(',') + ')'
    }

    function compileIdentifier(node, nameBinding) {
        if (nameBinding[node.name] === 'not param') {
            // values that aren't parameters are computed lazily, hence the
            // need for function call parens here.
            return node.name + "()"
        } else {
            return node.name
        }
    }

    function compileFunction(node, nameBinding) {
        var parameters = node.parameters,
            localNames = node.localNames || [],
            i;

        nameBinding = Object.create(nameBinding)

        function getName(param) {
            return param.name
        }

        function paramInitialization() {
            return parameters
                .filter(function(p) { return p.value !== null })
                .map(function(p) {
                    return p.name + '=' + p.name + '!==undefined?' + p.name + ':' + compile(p.value, nameBinding) + ';'
                }).join('')
        }

        function localNameInitializers() {
            return localNames.map(function(n) {
                return ';' + "function "+n.name+"(){"+
                   "if(_bs_cache_"+n.name+"===void 0)_bs_cache_"+n.name+"="+compile(n.value, nameBinding)+";"+
                   "return _bs_cache_"+n.name+"}"
            })
        }

        for (i = 0; i < parameters.length; i++) {
            nameBinding[parameters[i].name] = 'param'
        }

        for (i = 0; i < localNames.length; i++) {
            nameBinding[localNames[i].name] = 'not param'
        }

        return '(function(' + parameters.map(getName).join(',') + '){'+
            paramInitialization()+
            'return '+compile(node.body, nameBinding)+
            localNameInitializers()+
            '})'
    }

    function compileNumber(node) {
        return node.value
    }

    function repeatString(s, n) {
        var repetitions = new Array(n), i
        for (i = 0; i < n; i++) {
            repetitions[i] = s
        }
        return repetitions.join('')
    }

    function reverse(array) {
        var copy = array.slice(), i, iFromEnd

        for (i = 0; i < array.length / 2; i++) {
            iFromEnd = array.length - 1 - i
            copy[i] = array[iFromEnd]
            copy[iFromEnd] = array[i]
        }

        return copy
    }
})();
