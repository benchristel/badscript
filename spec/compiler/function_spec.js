describe('compiling functions', function() {
    "use strict";

    var Parser = require('../../parser.js')
    var Compiler = require('../../compiler.js')

    function compileJS(s) {
        var parsed = Parser.parse(s)
        return Compiler.compile(parsed)
    }

    it('works for a function with no params list', function() {
        expect(compileJS("{ 1 }")).toEqual("(function(){return 1})")
    })

    it('works for a function with an empty params list', function() {
        expect(compileJS("{() 1 }")).toEqual("(function(){return 1})")
    })

    it('works for a function with one parameter', function() {
        expect(compileJS("{(one) 1 }")).toEqual("(function(one){return 1})")
    })

    it('works for a function with two parameters', function() {
        expect(compileJS("{(one, two) 1 }")).toEqual("(function(one,two){return 1})")
    })

    it('works for a curried function', function() {
        expect(compileJS("{(one)(two) one }")).toEqual("(function(one){return (function(two){return one})})")
    })

    it('initializes parameters with their defaults', function() {
        expect(compileJS("{(n:1) n }")).toEqual("(function(n){n=n!==undefined?n:1;return n})")
    })

    it('initializes parameters of curried functions', function() {
        expect(compileJS("{(n:1)(p:2) n }")).toEqual("(function(n){n=n!==undefined?n:1;return (function(p){p=p!==undefined?p:2;return n})})")
    })

    it('tolerates surrounding whitespace', function() {
        expect(compileJS(" {1} ")).toEqual("(function(){return 1})")
    })

    it('creates JS functions that lazily evaluate and cache intermediate values', function() {
        var expected = "(function(f){"+
          "return g();"+
          "function g(){"+
          "if(_bs_cache_g===void 0)_bs_cache_g=f(f);"+
          "return _bs_cache_g}})"

        expect(compileJS("{(f) g --- g: f(f)}")).toEqual(expected)
    })
})
