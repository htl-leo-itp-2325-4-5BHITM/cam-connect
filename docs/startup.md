## Backend
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

## Frontend

### Web
Open the whole project in Webstorm, VsCode or similar.

Web is based on webpack, run it by cd-ing to the web folder and running `npm start`

The project is now accessible at localhost:4000

### IOS
Open the whole project in Xcode.

### Android
Open the whole project in AndroidStudio or similar.

## Docs

To run the uml file, install the "PlantUML Integration" plugin in IntelliJ