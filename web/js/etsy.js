(function(exports) {
	"use strict";

	var BASE_URL = "https://openapi.etsy.com/v2/listings";
  	var API_KEY  = "skg82rpwr3x8t285zcj6z03w";

	var Etsy = {
	    listing_url: 		BASE_URL + "/active.js?api_key="	  + API_KEY
	  , product_url: 		BASE_URL + "/%id%.js?api_key=" 		  + API_KEY
	  , product_image_url:  BASE_URL + "/%id%/images.js?api_key=" + API_KEY

	  , getListing: function(options, errback) {

	  		var deferred = $.Deferred();
	  		deferred.fail(errback);

			var getData = function(data) {
				if (data.ok) {
					deferred.resolve(data);
				}
				else {
					var msg = "getListing(): Invalid response from server " +
								this.listing_url + "/" + + JSON.stringify(data);
					deferred.reject(msg);
				}			
			};

			var url = this.listing_url;

			$.ajax({
				url: url
			  , dataType: 'jsonp'
			  , data: options
			  , success: getData // cannot be part of the deferred
			  , error: deferred.reject
			});

			return deferred.promise();
		}
	  , getProductImages: function(product, errback) {
	  		var id = product.listing_id;
	  		var url = this.product_image_url.replace("%id%", id);
			// alert(url);

	  		var deferred = $.Deferred();
			deferred.then( function(product, images) {
				product.images = images;
			}, errback );

			var getImageData = function(data) {
				if (data.ok) {
					if (data.count && data.count > 0) {
						deferred.resolve(product, data.results);
					}
					else {
						var msg = "getProductImages(): No images " + url;
						deferred.reject(msg);
					}
				}
				else {
					// Exceeded quote: 10 requests per second
					var msg = "getProductImages(): Invalid response from server: " + JSON.stringify(data);
					deferred.reject(msg);
				}			
			};

			$.ajax({
				url: url
			  , dataType: 'jsonp'
			  , success: getImageData // cannot be part of the deferred
			  , error: deferred.reject
			});

			return deferred.promise();
		}
	};

	var EtsySearch = (function() {

		var errback = function(err) {
			alert(err);
		}

		var doListing = function(keywords) {
			var listing = Etsy.getListing(keywords, errback);

			listing.fail(errback);

			var imgLoadedDeferred = $.Deferred();

			listing.done(function(data) {
				var products = data.results;

				var imgDeferreds = [];

				// Delay every second: ETSY: up to 10 requests per second
				var batches = Math.floor(products.length/8) + products.length%8;

				var delayPerBatch = 1200; // A little over 1000 ms

				for (var i = 0; i < batches; i++) {
					(function(iter) {
						setTimeout(function() {
							var batch = products.slice(iter*8, (iter+1)*8);
							for (var j = 0; j < batch.length; j++) {
								var d = Etsy.getProductImages(batch[j], errback);
								imgDeferreds.push(d);
							}
						}, delayPerBatch * iter);
					})(i);
				}

				setTimeout(function() {
					// console.log("To process " + imgDeferreds.length);
					var collectiveDeferred = $.when.apply($, imgDeferreds);
					collectiveDeferred.then( function() {
						imgLoadedDeferred.resolve(products);
					}, imgLoadedDeferred.reject );
				}, delayPerBatch * batches);

			});
			return imgLoadedDeferred.promise();
		};

		var find = function(options) {
			return doListing(options);
		};

		return {
			find: find
		}
	})();

	exports.Etsy = Etsy;
	exports.EtsySearch = EtsySearch;

})(window);
