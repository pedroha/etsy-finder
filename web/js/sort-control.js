(function(exports, $, Backbone, _) {
	"use strict";

	var ProductRouter = Backbone.Router.extend({
		initialize: function(listing) {
			this.listing = listing;
		}
	  , routes: {
			"": "empty",
			"about" : "showAbout",
			"listing/:keywords": "search",
			"listing/:keywords/:sort_field/:sort_dir" : "search",
			"listing/:keywords/:sort_field/:sort_dir/:id" : "search"
		}
	  , empty: function() {
			//alert("empty root");
			this.search();
		}
	  , showAbout: function() { console.log("hello About"); }
	  , search: function(keywords, sort_field, sort_dir, id) {
			// Client-side sorting

			keywords = keywords || "";
			sort_field = sort_field || "price";
			sort_dir = sort_dir || "DESC";

			if (id) {
				alert("We need to show Product " + id);
			}
			else {
				this.listing.collection.setSortField(sort_field, sort_dir);
				this.listing.render();
			}
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

	exports.ProductRouter = ProductRouter;
	exports.SortControl = SortControl;

})(window, jQuery, Backbone, _);

