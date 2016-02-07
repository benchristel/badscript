module.exports = (function() {
    "use strict";

    return {
        compile: compile
    }

    function compile(rootNode) {
        switch (rootNode.type) {
            case 'String':
                return compileString(rootNode)
            case 'StringData':
                return compileStringData(rootNode)
            case 'Expression':
                return compileExpression(rootNode)
            case 'Identifier':
                return rootNode.name
        }
        throw "unidentified node type for compilation: "+rootNode.type
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
})();
