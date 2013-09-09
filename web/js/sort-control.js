var ProductRouter = Backbone.Router.extend({

  routes: {
  	"": "empty",
    "about" : "showAbout",
    "listing/:keywords": "search",
    "listing/:keywords/:sort_field/:sort_dir" : "search",
    "listing/:keywords/:sort_field/:sort_dir/:id" : "search"
  },

  empty: function() {
  	//alert("empty root");
  	this.search();
  },

  showAbout: function() { console.log("hello About"); },

  search: function(keywords, sort_field, sort_dir, id) {

  	// Better search: everytime we SORT by field -> query again! but more expensive!?

  	keywords = keywords || "";
  	sort_field = sort_field || "price";
  	sort_dir = sort_dir || "DESC";

  	/*
  	if (id) {
  		alert("We need to show Product " + id);
  	}
  	else {
  		alert("Showing... " + keywords + " " + sort_field + " / " + sort_dir);
  	}
  	*/

  	// SORT Dilemma: several options
  	// 1) Requery with new sort options back to the server (better data with sorting)
	// 2) Sort only on the client data (with Backbone sort)
	// 3) Use isotope for visual sorting purely on the client data

	// For simplicity and accuracy, 1) requery the server
  }
});


var SortControl = (function() {

	var showSort = function(options) {
		console.log(options);
	};

	var init = function(fn) {
		showSort = fn;
	};

	// Sort control		
	var sortOptions = {
		direction: "ASC"
	  , field: "title"
	};
	
	$('#sort-field-select').val(sortOptions.field);

	$('#sort-asc-btn').on('click', function() {
		sortOptions.direction = "ASC";
		showSort(sortOptions);
	});
	$('#sort-desc-btn').on('click', function() {
		sortOptions.direction = "DESC";
		showSort(sortOptions);
	});

	$('#sort-field-select').on('change', function() {
		sortOptions.field = $(this).val();
		showSort(sortOptions);
	});

	return {
		init: init
	};
})();
