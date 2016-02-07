describe('compiling strings', function() {
    "use strict";

    var Parser = require('../../parser.js')
    var Compiler = require('../../compiler.js')

    function compileJS(s) {
        var parsed = Parser.parse(s, {startRule: 'String'})
        return Compiler.compile(parsed)
    }

    it('preserves single quotes', function() {
        expect(compileJS("'bang!'")).toEqual("'bang!'")
    })

    it('preserves double quotes', function() {
        expect(compileJS('"bang!"')).toEqual('"bang!"')
    })

    it('interpolates expressions', function() {
        expect(compileJS('"hello \\(name)!"')).toEqual('"hello "+name+"!"')
    })
})
