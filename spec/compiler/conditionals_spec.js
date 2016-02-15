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

    it('works with "X but if Y then Z" syntax', function() {
        var badscript = "1 but if foo then 2"
        var expected = "(foo)?(2):(1)"

        expect(compileJS(badscript)).toEqual(expected)
    })

    it('works with "when X then Y" syntax', function() {
        var badscript = "when 1 then 2 when 3 then 4 else 0"
        var expected = "(1)?(2):((3)?(4):(0))"

        expect(compileJS(badscript)).toEqual(expected)
    })
})
