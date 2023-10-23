# cam-connect conventions

## General

- cam-connect should be spelled with a - and in lowercase wherever possible
- all internal planning documents, files, comments, documentations should be in english
- all external proposals, progress reports, documentations should be in german

## Code and file formatting

- use snake_case_and-kebab-case for folder names
- use camelCase or PascalCase for filenames
- use english for filenames and comments
- '{' brackets should be on the same lines as the code they belong tho, seperated by a whitespace from the closing ')'
- every major piece of code: ifs, loops, functions etc should be seperated by a empty line from the previous
- if condition nesting should be avoided, instead invert the condidition and return early

```JS
    function checkStatus() {
        let status = false
        return false
    }
    
    if(doSomething() === true) {
        console.log("everything is fine")
    }
```

### JS specifics

- checks should be done with === instead of ==, this also checks for the type: 1 == '1' is true 2 === '2' is not true
- semicolons should be avoided wherever possible

## Style

- use the font quicksand on every UI
- use the accent color #notyetdecided
