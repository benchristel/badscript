describe("an identifier", function() {
    "use strict";

    var Parser = require('../parser.js')

    function parse(s) {
        return Parser.parse(s, {startRule: 'Identifier'})
    }

    it("may consist of alphanumeric characters and underscores", function() {
        var result = parse("Abcd_1234")

        expect(result.type).toEqual("Identifier")
        expect(result.name).toEqual("Abcd_1234")
    })

    it("forbids numbers as the first character", function() {
        expect(function() { parse("1a") }).toThrowError()
    })
})
