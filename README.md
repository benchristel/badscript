# BadScript

The baddest programming language in town.

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
