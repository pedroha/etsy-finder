var SearchControl = {
	init: function() {

		var search = function(evt) {
			var keywords = $('#keywords').val();					
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
  , searchByKeywords: function(keywords) {
  		var options = null;

  		if (keywords) {
  			options = {
  				keywords: keywords
  			}
  		}

  		$.blockUI({
  			message: 'Loading content &nbsp;&nbsp;&nbsp;<img src="../img/ajax/clover_48.gif" style="position:relative;top:10px;left:0"/>',
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

		var deferred = EtsySearch.find(options);

		deferred.done(function(products) {
			$.unblockUI();

			var list = [];

			// Transform from Etsy Product format to a simpler one
			for (var i = 0; i < products.length; i++) {
				var p = products[i];
				var item = {
					id: p.listing_id
				  , title: p.title
				  , description: p.description
				  , price: p.price
				  , currency_code: p.currency_code
				};
				if (p.images && p.images.length > 0) {
					var img = p.images[0];
					item['url_170x135']   = img['url_170x135'];
					item['url_fullxfull'] = img['url_fullxfull'];
				}
				list.push(item);
			}
			showModel(list);
		});
 	}
};

function showModel(list) {
	var template = [
		'<li>\n'
	  , '   <img src="%url_170x135%"/>'
	  , '   <p>%title%</p>'
	  , '</li>'
	];

	var tmpl = template.join('');

	var pieces = [];

	for (var i = 0; i < list.length; i++) {
		var it = list[i];
		var s = tmpl.replace("%url_170x135%", it['url_170x135'])
				    .replace("%title%", it['title']);

		pieces.push(s);

	}
	var $list = $('<ul>');
	$list.append( pieces.join('') );
	$('#products').empty().append($list);
}
