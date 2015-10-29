var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function(){

    initializeTabletopObject("https://docs.google.com/spreadsheets/d/1WapMdzj1DJWuBOBN1TLrtxTVXak2KjdixGVxHjcRp9s/pubhtml");

});

// pull data from google spreadsheet
function initializeTabletopObject(dataSpreadsheet){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: writeTableWith,
        simpleSheet: true,
        debug: false
    });
}

// create table headers
function createTableColumns(){

    /* swap out the properties of mDataProp & sTitle to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [
        {"mDataProp": "gender", "sTitle": "Gender", "sClass": "center"},
        {"mDataProp": "age", "sTitle": "Age", "sClass": "center"},
        {"mDataProp": "country", "sTitle": "Country", "sClass": "center"},
		{"mDataProp": "advice", "sTitle": "Advice", "sClass": "center"},
        {"mDataProp": "place", "sTitle": "Advice", "sClass": "center"},
		{"mDataProp": "locationscrub", "sTitle": "Location Scrub", "sClass": "center"},
        {"mDataProp": "place", "sTitle": "Place", "sClass": "center"},
        {"mDataProp": "typeofadvice", "sTitle": "Type of Advice", "sClass": "center"},
        {"mDataProp": "categoryofevent", "sTitle": "Category of Event", "sClass": "center"},
        {"mDataProp": "agebucket", "sTitle": "Age Bucket", "sClass": "center"},
        {"mDataProp": "agegroup", "sTitle": "Age Group", "sClass": "center"},
        {"mDataProp": "date", "sTitle": "Date", "sClass": "center"},
        {"mDataProp": "city", "sTitle": "City", "sClass": "center"},
        {"mDataProp": "stateprovince", "sTitle": "State / Province", "sClass": "center"},
        {"mDataProp": "country", "sTitle": "Country", "sClass": "center"},
        {"mDataProp": "name", "sTitle": "Name", "sClass": "center"},
        {"mDataProp": "gender", "sTitle": "Gender", "sClass": "center"}
	];
    return tableColumns;
}

// create the table container and object
function writeTableWith(dataSource){

    jqueryNoConflict("#demo").html("<table cellpadding='0' cellspacing='0' border='0' class='display table table-bordered table-striped' id='data-table-container'></table>");

    var oTable = jqueryNoConflict("#data-table-container").dataTable({
        "sPaginationType": "bootstrap",
        "iDisplayLength": 25,
        "aaData": dataSource,
        "aoColumns": createTableColumns(),
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        }
    });

};

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort["string-case-asc"]  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort["string-case-desc"] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};
