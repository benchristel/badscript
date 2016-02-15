describe("a string", function() {
    "use strict";

    var Parser = require('../parser.js')

    function parse(s) {
        return Parser.parse(s)
    }

    it("may be surrounded by double quotes", function() {
        var result = parse('"totally a string"')

        expect(result.type).toEqual("String")
        expect(result.quote).toEqual('"')
        expect(result.parts[0].value).toEqual("totally a string")
    })

    it("may be surrounded by single quotes", function() {
        var result = parse("'totally a string'")

        expect(result.type).toEqual("String")
        expect(result.quote).toEqual("'")
        expect(result.parts[0].value).toEqual("totally a string")
    })

    it("preserves escaped quotes for ease of compilation back to JS (double-quoted strings)", function() {
        var result = parse('"the cat says \\"hello\\"."')

        expect(result.type).toEqual("String")
        expect(result.parts[0].value).toEqual('the cat says \\"hello\\".')
    })

    it("preserves escaped quotes for ease of compilation back to JS (single-quoted strings)", function() {
        var result = parse("'the cat says \\'hello\\'.'")

        expect(result.type).toEqual("String")
        expect(result.parts[0].value).toEqual("the cat says \\'hello\\'.")
    })

    it("preserves single-char escape sequences (double-quoted strings)", function() {
        var result = parse('"line\\nbreak"')

        expect(result.type).toEqual("String")
        expect(result.parts[0].value).toEqual("line\\nbreak")
    })

    it("preserves single-char escape sequences (single-quoted strings)", function() {
        var result = parse("'line\\nbreak'")

        expect(result.type).toEqual("String")
        expect(result.parts[0].value).toEqual("line\\nbreak")
    })

    it("allows expression interpolation with backslash parens (double-quoted strings)", function() {
        var result = parse('"hello \\(name)!"')

        expect(result.type).toEqual("String")
        expect(result.parts).toEqual([
            {type: 'StringData', value: 'hello ', quote: '"'},
            {type: 'Identifier', name: 'name'},
            {type: 'StringData', value: '!', quote: '"'},
        ])
    })

    it("allows expression interpolation with backslash parens (single-quoted strings)", function() {
        var result = parse("'hello \\(name)!'")

        expect(result.type).toEqual("String")
        expect(result.parts).toEqual([
            {type: 'StringData', value: 'hello ', quote: "'"},
            {type: 'Identifier', name: 'name'},
            {type: 'StringData', value: '!', quote: "'"},
        ])
    })
})
