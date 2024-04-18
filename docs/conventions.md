# cam-connect conventions
Please take the time to read this, I will tell you when its updated. 
\
If you follow these conventions we will have a better time writing code and the project can be handed off to the next group in a nice shape.

user stories can be found [here](https://school-space.notion.site/4c889b6df8a14f3f82b6824f652f1f3d?v=6db8b43a662a4b3bb87f1b68ae708395&pvs=4)

## General
- cam-connect should be spelled with a dash and in lowercase wherever possible
  - alternatively "cc" can be used for things like components: `cc-button`
- all internal planning documents, files, comments, commit messages, documentations should be in **english**
- all external proposals, progress reports, documentations should be in **german**

## Workflow / GitHub
- When completing a issue move it to the "Review" area (not done)
  - yanik will check out the issue and either
    - move it to done
    - write a comment on what needs more work
- The Main branch should **always be runnable**
- Commit often, this just safes your work to your local git
  - commit messages 
    - should be precise and short
    - should start with the issue number your working on or with "hotfix:", "refactor:", "minor:" or something similar when not working on any issue
    - `#0 Updated Workflow section in convetions.md`
  - if many things were changed write a description
- Push at the end of each workday and when leaving school .-.
  - if something is throwing errors add a //TODO and **comment it out**
  - if your issue is constantly throwing errors you can create a feature branch
    - name it `#issueId` & a super short description of your issue
    - switch to that branch, work there until its all done and then create a pull request to dev
- When a sprint is finished
  - The dev branch will be merged with main
  - A description of the major changes will be added to the [changelog](./changelog.md) and pull request
  - if necessary the [feature list](../README.md/#features) will be updated

## Code and file formatting
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
- every major, bigger block of functions (all that create a new entry, all that display refresh and edit the devices, etc.)
  should be wrapped in a `//region name ..code here.. //endregion` that way they can be folded in webstorm
- when using variables which uses are not immediatly clear add a comment on the same line to explain or on the line above to explain for multiple
- script, style and mockup files belonging together should have the same name
- Id should be written like this `thingId`

## Names
- use camelCase for folder names
- use camelCase (or PascalCase for classes) for filenames, and css class names
- `{` brackets should be on the same lines as the code they belong to
- use snake_case for database variables
  - whenever a variable is used as an foreign key it should be named simply `<object>` when it contains a entity and `<object>_id` when it contains the id. This should be the case everywhere.
  - these _ names should be kept the same all throughout the project. Eg. when passing them to the frontend.

### Function names
- functions that create a new thing should be named `createSomething`
- functions that search for something should be named `searchForSomething`
- functions that get a specific thing that already exists by a specific param should be named `getAllSomethings` / `getSomethingByID`
- functions that use existing data to calculate a result should be named `calculateSomthing`
- functions that convert one thing to another should be named `somethingToSomething` or `somethingAsSomething`

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
    if(!verifyAdminPassword(document.querySelector('.adminPasswordInput').innerHTML)){ //input password matchs with that in db
        displayError("The entered password is not correct")
        return false
    }
    
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
- use `string` instead of `String` whenever possible

### CSS specific
- there should be a base stylesheet whenever multiple pages need the same style
- don't nest multiple container selectors only sub items or pseudo selectors
- classnames and similar should be camelCase
- units
  - do not use pixels
  - use `rem` for text related sizes: font size, text container, height etc.
  - use `vw` for standalone widths, that of: popups, big areas, etc.
  - use `%` for the width of child items
  - use `ch` for text width: this represents how many characters can fit
- try to use `box-sizing: border-box` to make designs more robust
- use grids and their gap property
- use `aspect-ratio: 1` for squares
- use width/height `fit-content` for auto scaling
- check if a variable already exists for what you are setting, transition times colors fontsizes etc. all have variables
- containers that simply group a few pieces of content together inside a container should have the class "left", "right" etc.
- do not use :last-child or simmilar selectors for non lists:
  - these should only be used to select the last element of an *unknown* number of items in a list
  - these should not be used for selecting predefined sub containers, text boxes or simmilar
  - since these dont target specific containers but any item of that type they can easily lead to unexpected results

For those that don't know scss this will seem weird, it's actually pretty easy
```SCSS
$accent: #4095BF; //defines a variable

.equipmentItem{
  &:hover{ //compiles to .equipmentItem:hover{}
    color: $accent;
  }
  
  h2{ //compiles to .equipmentItem h2
    font-family: quicksand, sans-serif;
  }
}

.equipmentItem .tags{
  &::before{
    content: 'hey';
    background-color: white;
  }
  
  &.marked{ //compiles to .equipmentItem .tags.marked
    color: black;
  }
}
```

## JAVA specific
- Api routes should be implemented in the same order as they are in the api.md documentation
- If the route does not yet exist in the docu file it should be added (further instructions in the file) 