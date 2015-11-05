var jqueryNoConflict = jQuery;
var CSH = {};
// begin main function
jqueryNoConflict(document).ready(function(){

    initializeTabletopObject("https://docs.google.com/spreadsheets/d/1mHcnstovekJOceCtlcESnKaWfkbrMoChVPu8hgF4_f4/pubhtml?gid=22972212&single=true");
    $("#table").hide();
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

var tableColumns = [
  {"mDataProp": "advice", "sTitle": "Advice", "sClass": "center"},
  {"mDataProp": "namescrub", "sTitle": "Name", "sClass": "center", "hasFilter": true},
  {"mDataProp": "typeofadvice", "sTitle": "Category", "sClass": "center", "hasFilter": true},
  {"mDataProp": "authororiginscrub", "sTitle": "Author Origin", "sClass": "center", "hasFilter": true},
  {"mDataProp": "standlocation", "sTitle": "Stand Location", "sClass": "center", "hasFilter": true},
  {"mDataProp": "date", "sTitle": "Date", "sClass": "center"},
  {"mDataProp": "region", "sTitle": "Region", "sClass": "center", "hasFilter": true},
  {"mDataProp": "imageurl", "sTitle": "Image URL", "sClass": "center"}
];

var filterableColumns = $.grep(tableColumns, function(value, index) {
  return value.hasFilter;
});

var filterableColumnNames = $.map(filterableColumns, function(value, index) {
  return value.sTitle;
});

var filterableColumnIds = $.map(filterableColumns, function(value, index) {
  return value.mDataProp;
});

// create the table container and object
function writeTableWith(dataSource){

  jqueryNoConflict("#table").html("<table cellpadding='0' cellspacing='0' border='0' class='display table table-bordered table-striped' id='datatable'></table>");

  var table = jqueryNoConflict("#datatable").DataTable({
      "sPaginationType": "bootstrap",
      "iDisplayLength": 5,
      "aaData": dataSource,
      "aoColumns": tableColumns,
      "oLanguage": {
          "sLengthMenu": "_MENU_ records per page"
      },
      initComplete: function () {

        this.api().columns().every( function () {
          var column = this;
          var columnName = $(column.header()).text();

          var filterIndex = $.inArray(columnName, filterableColumnNames);

          if (filterIndex > -1) {
            var selectId = filterableColumns[filterIndex].mDataProp;
            var select = $('<select class="advice-filter" id="' + selectId + '" style="width:150px;"><option value="">' + columnName + '</option></select>')
              .appendTo( $("#filters") )
              .on( 'change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                  $(this).val()
                );

                column
                  .search( val ? '^'+val+'$' : '', true, false )
                  .draw();
              });

            column.data().unique().sort().each( function ( d, j ) {
              select.append( '<option value="'+d+'">'+d+'</option>' )
            });
          }
        });
      },
      "drawCallback": function( settings ) {
          var api = this.api();
          // if no filters are set, only show the current page of data
          // otherwise show the filtered data
          var rowData;

          var hasActiveFilters = $("#filters select").filter(function(value, index) {
            return $(this).val().length > 0;
          }).length > 0;

          rowData = hasActiveFilters ? api.rows({search:'applied'}).data() : api.rows({page: 'current'}).data();

          var imageRows = $.grep(rowData, function(value, index) {
             return value.imageurl;
          });

          var images = $.map(imageRows, function(value, index) {
            return "<img src='" + value.imageurl + "' />";
          });

          var $results = $("#results");
          if (images.length > 0) {
            $results.html(images.join('<br>'));
          } else {
            $results.html('No matches');
          }

      }
  });

  randomizeFilters()
};

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort["string-case-asc"]  = function(x,y) {
    return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort["string-case-desc"] = function(x,y) {
    return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};

function randomizeFilters() {
  // select a random table row
  // set the select boxes to the random row values
  //
  var rowData = $("#datatable").dataTable().api().rows().data();
  var randomRow = rowData[Math.floor(Math.random() * rowData.length)];

  $.each(randomRow, function(key, value) {
    var filterIndex = $.inArray(key, filterableColumnIds);
    if (filterIndex > -1) {
      var $filter = $('#' + filterableColumns[filterIndex].mDataProp);
      $filter.val(value);
      $filter.trigger('change');
    }

  });
}

function resetFilters() {
  $("#filters select").each(function() {
    $(this).val("");
    $(this).trigger('change');
  });
}
