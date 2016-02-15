describe('conditionals', function() {
    "use strict";

    var Parser = require('../parser.js')

    function parse(s) {
        return Parser.parse(s)
    }

    it('can have "X if Y else Z" syntax', function() {
        var parsed = parse(
          "1 if foo\n"+
          "  else 2")

        expect(parsed.type).toEqual('Expression')
        expect(parsed.condition.type).toEqual('Identifier')
        expect(parsed.condition.name).toEqual('foo')
        expect(parsed.value.value).toEqual('1')
        expect(parsed.alternative.value).toEqual('2')
    })

    it('can have "X but if Y then Z" syntax', function() {
        var parsed = parse("1 but if foo then 2")

        expect(parsed.type).toEqual('Expression')
        expect(parsed.condition.type).toEqual('Identifier')
        expect(parsed.condition.name).toEqual('foo')
        expect(parsed.value.value).toEqual('2')
        expect(parsed.alternative.value).toEqual('1')
    })
})