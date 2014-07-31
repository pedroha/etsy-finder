(function(exports, $, Backbone, _) {
	"use strict";

    var listing = new ProductListingView({el: $('product-list')});
	listing.collection.setSortField("price", "DESC");
//    listing.collection.fetch({keywords: "orange monkey"});
	SearchControl.init(listing);

	var myRouter = new ProductRouter(listing);

	Backbone.history.start();

	// URL Test cases:
	// etsy.html
	// etsy.html#
	// etsy.html#listing/blue marionette/title/ASC
	// etsy.html#listing/blue marionette/title/ASC/HHHHH

	SortControl.init(function showSort(options) {
		console.log(options);

		var keywords = SearchControl.getKeywords();
		var route = "listing/" + keywords + "/" + options.field + "/" + options.direction;
		myRouter.navigate(route, { trigger: true } );
	});

	if (Backbone.history.fragment) {
		var route = Backbone.history.fragment;
		if (/listing/.test(route)) {

			var keywordRegex = /listing\/([\s|\w]+)/;
			var keywords = keywordRegex.exec(route);

			if (keywords.length) {
				var keyword = keywords[1];
				$('#keywords').val(keyword);
				SearchControl.searchByKeywords(keyword);
			}
		}
	}

	exports.productRouter = myRouter;

})(window, jQuery, Backbone, _);
