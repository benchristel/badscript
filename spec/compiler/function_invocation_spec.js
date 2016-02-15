describe('compiling function invocations', function() {
    "use strict";

    var Parser = require('../../parser.js')
    var Compiler = require('../../compiler.js')

    function compileJS(s) {
        var parsed = Parser.parse(s)
        return Compiler.compile(parsed)
    }

    it('invokes a function with no arguments', function() {
        expect(compileJS('foo()')).toEqual('foo()')
    })

    it('invokes a function with one argument', function() {
        expect(compileJS('foo(1)')).toEqual('foo(1)')
    })

    it('invokes a function with two arguments', function() {
        expect(compileJS('foo(1, 2)')).toEqual('foo(1,2)')
    })

    it('chains invocations', function() {
        expect(compileJS('foo()(1, 2)')).toEqual('foo()(1,2)')
    })

    it('invokes a function defined inline', function() {
        expect(compileJS('(x){x}(1, 2)')).toEqual('(function(x){return x})(1,2)')
    })
})
