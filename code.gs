function getEnvironment() {
 var environment = {
   spreadsheetID: "****",	// replace with spreadsheetID (from url https://docs.google.com/spreadsheets/d/spreadsheetID/edit#gid=0)
   firebaseUrl: "*****"		// replace with firebase realtime database url (such as https://someappname.firebaseio.com/)
 };
 return environment;
}

// Creates a Google Sheets on change trigger for the specific sheet
function createSpreadsheetEditTrigger(sheetID) {
 var triggers = ScriptApp.getProjectTriggers();
 var triggerExists = false;
 for (var i = 0; i < triggers.length; i++) {
   if (triggers[i].getTriggerSourceId() == sheetID) {
     triggerExists = true;
     break;
   }
 }

 if (!triggerExists) {
   var spreadsheet = SpreadsheetApp.openById(sheetID);
   ScriptApp.newTrigger("importSheet")
     .forSpreadsheet(spreadsheet)
     .onChange()
     .create();
 }
}

// Delete all the existing triggers for the project
function deleteTriggers() {
 var triggers = ScriptApp.getProjectTriggers();
 for (var i = 0; i < triggers.length; i++) {
   ScriptApp.deleteTrigger(triggers[i]);
 }
}

// Initialize
function initialize(e) {
 writeDataToFirebase(getEnvironment().spreadsheetID);
}

// Write the data to the Firebase URL
function writeDataToFirebase(sheetID) {
 var ss = SpreadsheetApp.openById(sheetID);
 SpreadsheetApp.setActiveSpreadsheet(ss);
 createSpreadsheetEditTrigger(sheetID);
 var sheets = ss.getSheets();
 for (var i = 0; i < sheets.length; i++) {
   importSheet(sheets[i]);
   SpreadsheetApp.setActiveSheet(sheets[i]);
 }
}

// generate Menu JSON according to sheet data
function formJSON(data) {
  var menuObject = {};
  var output = menuObject;
  var FoodItemsObj = {};
  var PastryItemsObj = {};
  for (var i=0; i<=2; i++){
    if (data[i][0] === "pickupDate"){
      menuObject["pickupDate"]=data[i][1];
    }
    if (data[i][0] === "lastOrderDate"){
      menuObject["lastOrderDate"]=data[i][1];
    }
  }
  for (var i=2; i<data.length; i++) {
    if (data[i][0] === "FoodItems") {
      var newFItemObject = {};
      newFItemObject["hebName"] = data[i][3];
      newFItemObject["hebDesc"] = data[i][4];
      newFItemObject["engName"] = data[i][5];
      newFItemObject["engDesc"] = data[i][6];
      var hebOptionsObj={};
      var engOptionsObj={};
      var pricesObj={};
      hebOptionsObj[0] = data[i][7];
      if (data[i][10] !== "") hebOptionsObj[1] = data[i][10];
      engOptionsObj[0] = data[i][8];
      if (data[i][11] !== "") engOptionsObj[1] = data[i][11];
      pricesObj[0] = data[i][9];
      if (data[i][12] !== "") pricesObj[1] = data[i][12];
      newFItemObject["hebOptions"] = hebOptionsObj;
      newFItemObject["engOptions"] = engOptionsObj;
      newFItemObject["prices"] = pricesObj;
      var itemid = data[i][2];
      FoodItemsObj[itemid] = newFItemObject;
    }
    else if (data[i][0] === "PastryItems"){
      var newPItemObject = {};
      newPItemObject["hebName"] = data[i][3];
      newPItemObject["hebDesc"] = data[i][4];
      newPItemObject["engName"] = data[i][5];
      newPItemObject["engDesc"] = data[i][6];
      var hebOptionsObj={};
      var engOptionsObj={};
      var pricesObj={};
      hebOptionsObj[0] = data[i][7];
      if (data[i][10] !== "") hebOptionsObj[1] = data[i][10];
      engOptionsObj[0] = data[i][8];
      if (data[i][11] !== "") engOptionsObj[1] = data[i][11];
      pricesObj[0] = data[i][9];
      if (data[i][12] !== "") pricesObj[1] = data[i][12];
      newPItemObject["hebOptions"] = hebOptionsObj;
      newPItemObject["engOptions"] = engOptionsObj;
      newPItemObject["prices"] = pricesObj;
      var itemid = data[i][2];
      PastryItemsObj[itemid] = newPItemObject;
    }
  }
  menuObject["FoodItems"] = FoodItemsObj;
  menuObject["PastryItems"] = PastryItemsObj;
  Logger.log(JSON.stringify(output));
  return menuObject;
}

// Import each sheet when there is a change
function importSheet() {
 var sheet = SpreadsheetApp.getActiveSheet();
 var name = sheet.getName();
 var data = sheet.getDataRange().getValues();
 var dataToImport = formJSON(data);

 var token = ScriptApp.getOAuthToken();

 var firebaseUrl =
   getEnvironment().firebaseUrl + sheet.getParent().getId() + "/" + name;
 var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
 base.setData("", dataToImport);
}