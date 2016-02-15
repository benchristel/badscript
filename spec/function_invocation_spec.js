describe("a function invocation", function() {
    "use strict";

    var Parser = require('../parser.js')

    function parse(s) {
        return Parser.parse(s)
    }

    it("may have an empty argument list", function() {
        var parsed = parse('a()')

        expect(parsed.type).toEqual('PipeableExpression')
        expect(parsed.invocable.type).toEqual('Identifier')
        expect(parsed.invocable.name).toEqual('a')
        expect(parsed.invocations.length).toBe(1)
        expect(parsed.invocations[0].arguments).toEqual([])
    })

    it("may have one argument", function() {
        var parsed = parse('a(1)')

        expect(parsed.type).toEqual('PipeableExpression')
        expect(parsed.invocations.length).toBe(1)
        expect(parsed.invocations[0].arguments.length).toEqual(1)
        expect(parsed.invocations[0].arguments[0].value).toEqual('1')
    })

    it("may have multiple arguments", function() {
        var parsed = parse('a(1, 2)')

        expect(parsed.type).toEqual('PipeableExpression')
        expect(parsed.invocations.length).toBe(1)
        expect(parsed.invocations[0].arguments.length).toEqual(2)
        expect(parsed.invocations[0].arguments[0].value).toEqual('1')
        expect(parsed.invocations[0].arguments[1].value).toEqual('2')
    })

    it("may have multiple invocations", function() {
        var parsed = parse('a(1)()')

        expect(parsed.type).toEqual('PipeableExpression')
        expect(parsed.invocations.length).toBe(2)
    })

    it("works on functions defined inline", function() {
        var parsed = parse('(x) { x }(1)')

        expect(parsed.type).toEqual('PipeableExpression')
        expect(parsed.invocable.type).toEqual('Function')
        expect(parsed.invocations.length).toBe(1)
    })
})
