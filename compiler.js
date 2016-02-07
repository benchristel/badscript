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
        return compile(node.value)
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

        return 'function(' + node.parameters.map(getName).join(',') + '){'+
            paramInitialization(node.parameters)+
            'return '+compile(node.body)+
            '}'
    }

    function compileNumber(node) {
        return node.value
    }
})();
