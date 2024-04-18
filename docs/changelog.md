# cam-connect changelog
This file should be updated when ending a sprint and contain the same info as the pull request

## Sprint 3

- all entries in the webOld table are synced with the db
- the database and API structure is ~70% done
- created the webNew Frontend with webpack, typescript and SCSS and started creating components for main ui
- documented the API, how to run the project and code conventions 
- Updated the ERD

# Sprint 4

- replaced signatures with verification system via email
- created custom response system
- added option to import students and teachers as csv
- cleaned up Repositories and Resources

## Sprint 5

- switched to LIT
- implemented components from figma
- cleanup on old web
  - delete / return button functionality
  - disabled editing of confirmed rents
- switched to postgres db for deployment to oracle

## Sprint 6

- cleaned up components
  - migrated from lit-html to LIT
  - got fontawesome icons working
  - added icon support to buttons
- added the navbar and toolbar
- Implemented filter sidebar
  - filters are loaded from the backend
  - secondary filters only show when relevant primary filter is selected
- Updated all POST routes to use DTOs
- updated Import.sql to properly insert demo data
- created Tooltip system
- created Service System
- switched to websockets
- implemented basic rent/equipment page functionality

## Sprint 7

- Rent creation now works well in new UI
  - rents can be created using a list of rents not just one
  - dates can be selected nicely using the air datepicker libary
  - devices and students are displayed via dropdown
- created keyboard shortcut system
- rents are displayed properly (no edit functionality yet)
- DeviceTypes support string only types, and types that dont have a specific varient
- finished model / service file system
- cleaned up endpoints to all serve ccResponses
- linked rents and devices via websockets
- streamlined communication between components using AppState class
- said goodbye to old web

## Sprint 8

- finalized rent creation functionality with shortcuts, errors, better auto completion etc,
- added functioning edit functionality to rent list
  - edit dates and device of declined rents
  - return and delete rents
- finished proper versatile autocomplete component for dropdown suggestions
- created url handler to update the url with current page data
- moved confirmation logic to new web in a nicer more user friendly way
  - displays full list not one by one
  - proper feedback to user on success and fail states
  - proper link and verification code handling
- cleaned up column definition in backend
- created print view as old excel list
- added import functionality of all devicetypes and devices in edit page