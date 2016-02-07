describe("a function definition", function() {
    "use strict";

    var Parser = require('../parser.js')

    function parse(s) {
        return Parser.parse(s, {startRule: 'Expression'})
    }

    it("may have a list of parameters in parens", function() {
        var result = parse("(a b c) { null }")
        expect(result.parameters).toEqual([
            {type: 'Parameter', name: 'a', value: null},
            {type: 'Parameter', name: 'b', value: null},
            {type: 'Parameter', name: 'c', value: null}
        ])
    })

    it("may have an empty params list", function() {
        var result = parse("() { null }")
        expect(result.parameters).toEqual([])
    })

    it("may omit the parens if there are no params", function() {
        var result = parse("{ null }")
        expect(result.parameters).toEqual([])
    })

    it("may have default arguments", function() {
        var result = parse("(a:1) { a }")
        expect(result.parameters).toEqual([
            {type: 'Parameter', name: 'a', value: {type: 'Number', value: '1'}}
        ])
    })
})
