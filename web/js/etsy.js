(function(exports) {
	"use strict";

	var Etsy = {
		// TODO: can refactor urls: base + app_id
		listing_url: 		"https://openapi.etsy.com/v2/listings/active.js?api_key=skg82rpwr3x8t285zcj6z03w"
	  , product_url: 		"https://openapi.etsy.com/v2/listings/%id%.js?api_key=skg82rpwr3x8t285zcj6z03w"
	  , product_image_url:  "https://openapi.etsy.com/v2/listings/%id%/images.js?api_key=skg82rpwr3x8t285zcj6z03w"

	  , getListing: function(callback, errback) {

	  		var deferred = $.Deferred();
			deferred.then( callback, errback );

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

			$.ajax({
				url: this.listing_url
			  , dataType: 'jsonp'
			  , success: getData // cannot be part of the deferred
			  , error: deferred.reject
			});

			return deferred;
		}
	  , nop: function() {}
	  , getProductImages: function(product, errback) {
	  		var id = product.listing_id;
	  		var url = this.product_image_url.replace("%id%", id);
			// alert(url);

	  		var deferred = $.Deferred();
			deferred.then( function(product, images) {
				product.images = images;
			}, errback );

			var getImageData = function(data) {
				console.log(data);
				
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

			return deferred;
	  }	
	};

	var EtsySearch = (function() {

		var errback = function(err) {
			alert(err);
		}

		var listing = Etsy.getListing(function(){}, errback);

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
				console.log("To process " + imgDeferreds.length);

				var collectiveDeferred = $.when.apply($, imgDeferreds);
				collectiveDeferred.then( function() {
					imgLoadedDeferred.resolve(products);
				}, imgLoadedDeferred.reject );
			}, delayPerBatch * batches);

		});

		var find = function() {
			return imgLoadedDeferred;
		};

		return {
			find: find
		}
	})();

	exports.Etsy = Etsy;
	exports.EtsySearch = EtsySearch;

})(window);
