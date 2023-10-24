# cam-connect conventions
Please take the time to read this, I will tell you when its finished / updated. 
If you follow these conventions we will have a better time writing code and the project can be handed off to the next group in a nice shape. 

## General

- cam-connect should be spelled with a dash and in lowercase wherever possible
- all internal planning documents, files, comments, documentations should be in english
- all external proposals, progress reports, documentations should be in german

## Code and file formatting

- use camelCase for folder names
- use camelCase (or PascalCase) for filenames, and css class names
- `{` brackets should be on the same lines as the code they belong to
- every major piece of code: ifs, loops, functions, css selectors etc. should be seperated by a empty line from the previous
- condition nesting should be avoided, instead invert the condition and return early
- every major function should have a jsdoc comment overtop of it this should discribe
  - what the function does
  - what it returns
  - if necessary: what the params are used for
- every condition (if, while, switch) that is not immediately clear should have a comment explaining the condition 
in the same line as the bracket
- every codeblock which contents are not immediately clear should have a comment explaining its content overtop of it
- if you can't complete a piece of code right now, add a `//TODO` comment
- every major, bigger block of functions (all that create a new entry, all that display refresh and edit the devices) 
should be wrapped in a `//region name ..code here.. //endregion` that way they can be folded in webstorm
- when using variables which uses are not immediatly clear add a comment on the same line to explain or on the line abovce to explain for multiple
- script, style and mockup files belonging together should have the same name

this example is very basic, some of the comments are not needed here, but you get the idea
```JS
//region login handeling

/**
 * displays admin pannel if user entered the correct password
 * @returns true if login was successfull false if not
 */
function checkAdminPanelLogin() {
    //displays error to user
    if(document.querySelector('.passwordInput').innerHTML == ""){ //no password entered
        displayError("Please enter a password")
        return false
    }
    
    //displays error to user
    if(!verifyAdminPassword(document.querySelector('.passwordInput').innerHTML)){ //input password matchs with that in db
        displayError("The entered password is not correct")
        return false
    }
    
    displayAdminPannel()
    return true
}

function checkLogin(){
    //TODO implement login check
    return true
}

//endregion
```

### JS specifics

- most checks should be done with === instead of ==, this also checks for the type: 1 == '1' is true 2 === '2' is not true
- semicolons should be avoided wherever possible (this is a setting in webstorm so it wont add them automatically)

### style specific
- there should be a base stylesheet whenever multiple pages need the same style
- don't nest multiple container selectors only sub items or pseude selectors

For those that don't know scss this will seem weird, it's actually pretty easy
```SCSS
.equipmentItem{
  &:hover{
    color: red;
  }
  
  h2{
    font-family: quicksand, sans-serif;
  }
}

.equipmentItem .tags{
  &::before{
    content: 'hey';
    background-color: white;
  }
  
  .tag{
    color: black;
  }
}
```

## Style

- use the font quicksand on every UI
- use the accent color #notyetdecided

## Github
- branch names
- try to commit at the end of each workday
- commit messages should be precise and list all major changes
- issues
- pull requests will need to be approved to go through clean code will have no problem passing