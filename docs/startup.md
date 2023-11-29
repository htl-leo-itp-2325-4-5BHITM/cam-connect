## Backend
### initial
To run the backend open the whole project in IntelliJ and run the module cam-connect-backend.
\
If the module does not show up  edit your run configuration:
- click the selection field in the top right, left of the run button
- select "edit configurations"
- add a new configuration
- select quarkus
- select the module "cam-connect_backend"
- run the module

If you cant select the module try re adding it 
- choose `file > new > Module from Existing Sources`
- select the cam-connect_backend.iml file from the backend folder

If the Module still does not show up you need to only open the backend folder in IntelliJ and run the whole thing.

### errors
if you get errors related to no existent contstraints, wrong primary keys or simmilar this may be because quarkus has config files
that say that something exists that has been updated by a pull. These files sometimes do no get reloaded automatically. Try the following:
- select all the tables in the database explorer and delete them by pressing "entf", then rerun the project twice
- open the maven tab(should be above database) and run clean and recompile in the lifecycle area 
- right click the backend module and rebuild it

if you get errors with your maven version 
- open `file > settings`
- under `Build, Execution, Deployment > Build Tools > Maven`
- set the `Maven Home path:` to use the maven wrapper
- check the 5th checkbox to `Always update snapshots`


## Frontend

### Web
Open the whole project in Webstorm, VsCode or similar.

Web is based on webpack, run it by cd-ing to the web folder and running `npm start`

The project is now accessible at localhost:4200

### IOS
Open the whole project in Xcode.
    
### Android
Open the whole project in AndroidStudio or similar.

## Docs

To run the uml file, install the "PlantUML Integration" plugin in IntelliJ