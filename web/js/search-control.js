(function(exports, $) {

	var SearchControl = {
		init: function(listing) {
			this.listing = listing;

			var self = this;

			var search = function(evt) {
				var keywords = self.getKeywords();					
				SearchControl.searchByKeywords(keywords);
				return false;
			};

			$('#search-btn').on('click', search);
			$('#keywords').on('keypress', function(evt) {
				if (evt.keyCode === 13) {
					return search(evt);
				}
			});
		}
	  , getKeywords: function() {
			var keywords = $('#keywords').val();
			return keywords;  	
	  }
	  , searchByKeywords: function(keywords) {
	  		var options = null;

	  		if (keywords) {
	  			options = {
	  				keywords: keywords
	  			}
	  		}

	  		$.blockUI({
	  			message: 'Loading content &nbsp;&nbsp;&nbsp;<img src="img/ajax/clover_48.gif" style="position:relative;top:10px;left:0"/>',
	  			css: {
	  				font: '2em Georgia',
	  				'line-height': '2em',
	  				'vertical-text-align': 'text-top',
		            border: 'none', 
		            padding: '15px', 
		            backgroundColor: '#000', 
		            '-webkit-border-radius': '10px', 
		            '-moz-border-radius': '10px', 
		            opacity: .5, 
		            color: '#fff'
		        }
		    });
		    setTimeout($.unblockUI, 10000); // MAX timeout: 10 seconds

		    var deferred = this.listing.collection.fetch(options);
			deferred.done(function(products) {
				$.unblockUI();
			});
	 	}
	};

	exports.SearchControl = SearchControl;

})(window, jQuery);
