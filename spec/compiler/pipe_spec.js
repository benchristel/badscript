describe('compiling pipe expressions', function() {
    "use strict";

    var Parser = require('../../parser.js')
    var Compiler = require('../../compiler.js')

    function compileJS(s) {
        var parsed = Parser.parse(s)
        return Compiler.compile(parsed)
    }

    it('calls a function with the >> operator', function() {
        expect(compileJS('a >> b')).toEqual('b(a)')
    })

    it('composes functions with the >> operator', function() {
        expect(compileJS('a >> b >> c')).toEqual('c(b(a))')
    })

    it('applies the >> operator with the lowest precedence', function() {
        expect(compileJS('a(d, 2) >> b(1) >> (x) { x }')).toEqual('(function(x){return x})(b(1)(a(d,2)))')
    })
})
