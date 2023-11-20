# cam-connect conventions
Please take the time to read this, I will tell you when its finished / updated. 
If you follow these conventions we will have a better time writing code and the project can be handed off to the next group in a nice shape. 

## General

- cam-connect should be spelled with a dash and in lowercase wherever possible
  - alternatively "cc" can be used for things like components: `cc-button`
- all internal planning documents, files, comments, commit messages, documentations should be in english
- all external proposals, progress reports, documentations should be in german

## Workflow
Starting work on a new issue
- move it to the "In Progress" category
- create a branch based on the "dev" branch with your issue id and a super short description `#0 Explaining the Workflow`

Completing a Issue
- move your issue to the "Review" area
- create a pull request
- yanik will either approve or decline the request, in the second case he will comment on your issue with things that need improvement

## Github
- push at the end of each workday and when leaving school .-.
- if **something is throwing errors** at the end of the day add a //TODO comment and **comment it out** so that others can continue without having to change/fix your code
- create a branch for your task with a fitting name
  - when finished with the task set its status to review and create a pull request
  - a team member will approve the pull request or leave a comment on parts that should be improved
- commit messages should be precise and list all major changes

## Code and file formatting

- use camelCase for folder names
- use camelCase (or PascalCase) for filenames, and css class names
- `{` brackets should be on the same lines as the code they belong to
- use snake_case for database variables
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
- when using variables which uses are not immediatly clear add a comment on the same line to explain or on the line above to explain for multiple
- script, style and mockup files belonging together should have the same name
- Id should be written like this `thingId`
- functions that create a new thing should be named `create` 
- functions that search for something should be named `search` 
- functions that get a specific thing by a specific param should be named `get`

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

### TS specifics

- most checks should be done with === instead of ==, this also checks for the type: 1 == '1' is true 2 === '2' is not true
- semicolons should be avoided wherever possible (this is a setting in webstorm so it won't add them automatically)
- use .innerText instead of .innerHtml whenever you dont want to add elements to the DOM, this way you avoid injections

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
- use the accent color `#4095BF` `hsl(200, 50, 50)`