module.exports = (function() {
    "use strict";

    return {
        compile: compile
    }

    function compile(node) {
        switch (node.type) {
            case 'String':
                return compileString(node)
            case 'StringData':
                return compileStringData(node)
            case 'Expression':
                return compileExpression(node)
            case 'PipeableExpression':
                return compilePipeableExpression(node)
            case 'Invocation':
                return compileInvocation(node)
            case 'Identifier':
                return node.name
            case 'Function':
                return compileFunction(node)
            case 'Number':
                return compileNumber(node)
        }
        throw "unidentified node type for compilation: "+node.type
    }

    function compileString(node) {
        return node.parts.map(compile).join('+')
    }

    function compileStringData(node) {
        return node.quote + node.value + node.quote
    }

    function compileExpression(node) {
        // translate pipes, e.g. a >> b >> c, into function composition, e.g.
        // c(b(a))

        var expressions = node.pipeableExpressions.slice().reverse()

        return expressions.map(function(ex) { return compile(ex) }).join('(') + repeatString(')', expressions.length - 1)
    }

    function compilePipeableExpression(node) {
        return compile(node.invocable) + node.invocations.map(compile).join('')
    }

    function compileInvocation(node) {
        return '(' + node.arguments.map(compile).join(',') + ')'
    }

    function compileFunction(node) {
        function getName(param) {
            return param.name
        }

        function paramInitialization(params) {
            return params
                .filter(function(p) { return p.value !== null })
                .map(function(p) {
                    return p.name + '=' + p.name + '!==undefined?' + p.name + ':' + compile(p.value) + ';'
                }).join('')
        }

        return '(function(' + node.parameters.map(getName).join(',') + '){'+
            paramInitialization(node.parameters)+
            'return '+compile(node.body)+
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
})();
