var Etsy = {
	// TODO: can refactor urls: base + app_id
	listing_url: 		"https://openapi.etsy.com/v2/listings/active.js?api_key=skg82rpwr3x8t285zcj6z03w"
  , product_url: 		"https://openapi.etsy.com/v2/listings/%id%?api_key=skg82rpwr3x8t285zcj6z03w"
  , product_image_url: "https://openapi.etsy.com/v2/listings/%id%/images?api_key=skg82rpwr3x8t285zcj6z03w"

  , getListing: function(callback, errback) {
		
		var getData = function(data) {
			if (data.ok) {
				callback(data);
			}
			else {
				errback("getListing(): Invalid response from server " + this.listing_url);
			}			
		};

		var deferred = $.ajax({
			url: this.listing_url
		  , dataType: 'jsonp'
		  , success: getData // cannot be part of the deferred
		  , error: errback
		});
	}
};
