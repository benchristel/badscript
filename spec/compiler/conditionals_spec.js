describe('compiling conditionals', function() {
    "use strict";

    var Parser = require('../../parser.js')
    var Compiler = require('../../compiler.js')

    function compileJS(s) {
        var parsed = Parser.parse(s)
        return Compiler.compile(parsed)
    }

    it('works with "X if Y else Z" syntax', function() {
        var badscript = "1 if foo else 2"
        var expected = "(foo)?(1):(2)"

        expect(compileJS(badscript)).toEqual(expected)
    })
})
