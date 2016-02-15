# BadScript

The baddest programming language in town.

## Philosophy

BadScript is a Faux-O language inspired by Gary Bernhardt's talk _Boundaries_. Faux-O is a programming paradigm characterized by:

- **Functional patterns**. Data is immutable, and the bulk of the program's logic is composed of pure functions.
- **Object-oriented style**. Data is hidden within objects. Objects can communicate with each other by passing messages.

I've used a Faux-O style in a few projects I've worked on, and it seems like a winner. However, the languages I was working in (Ruby, Java, JavaScript) didn't have as many affordances for the style as I'd like. Kotlin seems like a good candidate since it's object-oriented but nudges you towards immutable data structures, but it's not the same as a natively Faux-O language.

BadScript _by itself_ is actually not capable of implementing a full Faux-O system. Gary describes the pattern of an "imperative shell" that manages side-effecty operations and calls into the "functional core", but it is not possible to write imperative code in BadScript. Therefore, all mutation of state has to be done by the environment in which BadScript is running. This environment might consist of JavaScript code that calls BadScript functions, or it might be the BadOS operating system (still in early-stage development).

## Don't Use It

BadScript is known to be bad. It compiles to JavaScript, after all, and introduces probably more weird behaviors than JavaScript had already. It almost certainly has performance issues in places you wouldn't expect. It will happily compile statements whose behavior is not defined by the spec. If you try to use it in a production system, you're most likely in for a hilarious sequence of events that will end in you getting fired. So please, don't do it.

## Syntax

A program in BadScript must consist of exactly one expression. (Since there is no mutation of data in BadScript, you never need to have multiple statements in a program.)
A program exports the value of its expression. This value can then be imported into other programs.

Here is a program that defines a simple `greeting(name)` function:

```
# greeting.bs
(name) {
  "Hello, \(name)!"
}
```

Function parameters may be anonymous. The `$` symbol represents an anonymous parameter.

```
# greeting2.bs
{ "Hello, \($)!" }
```

There are no variables (remember, no mutable state!) but values can be given names within a function.

```
# name_for_sorting.bs
(fullName) {
  "\(lastName), \(firstName)"

  firstName: names.first
  lastName:  names.last
  names:     fullName.split(/ /)
}
```

Values are lazy and cached, so the work of splitting `fullName` is done only once in the above example.

Defining object constructors is easy:

```
# user.bs
(fullName) {
  firstName: names.first
  lastName:  names.last
  ---
  names:     fullName.split(/ /)
}
```

This returns an object with `firstName` and `lastName` properties. The `names` value is private because it's below the `---` line.
All properties are lazily evaluated and cached.

Here's a simple example of how this user object might be used. Note the `.firstName` property access.

```
# first_names.bs
# takes a list of strings and returns the first whitespace-separated word of each.
(names) {
  names.map(User).map({ $.firstName })
  ---
  User: import('user')
}
```

## Compiling BadScript to JavaScript

The `jsify` executable converts BadScript to JavaScript. It takes BadScript input on `STDIN` and outputs JS to `STDOUT`.

```bash
./jsify < foo.bs > foo.js
```

## Development

```bash
# one-time setup:

npm install -g pegjs     # install the parser generator
npm install -g jasmine   # install the test framework
npm install -g uglify-js # minifies the final parser code

# start hacking:

vi badscript.pegjs       # edit the grammar file
./build                  # generate the parser and run the tests
```
