etsy-finder
===========

Find Etsy products using Etsy APIs
----------------------------------

	1. Search for a subset of Etsy's products. 
	2. View more details for a product
	3. Make the list sortable and able to remove items.


Developer Registration
http://www.etsy.com/developers/documentation/getting_started/register

APP NAME Etsy Finder
KEYSTRING skg82rpwr3x8t285zcj6z03w


API Documentation
=================

https://openapi.etsy.com/v2/listings/:listing_id.js

http://www.etsy.com/developers/documentation/reference/listing

JSONP
http://www.etsy.com/developers/documentation/getting_started/api_basics

Examples
========

Listings
https://openapi.etsy.com/v2/listings/active?api_key=skg82rpwr3x8t285zcj6z03w

Listing ID
https://openapi.etsy.com/v2/listings/98198249?api_key=skg82rpwr3x8t285zcj6z03w

Images
https://openapi.etsy.com/v2/listings/98198249/images?api_key=skg82rpwr3x8t285zcj6z03w


Resources
=========

	jquery
	jQuery BlockUI: http://www.malsup.com/jquery/block/
	Ajax Loaders: http://www.loadinfo.net, http://preloaders.net/


SORT Dilemma: several options
=============================
 1) Requery with new sort options back to the server (better data with sorting)
 2) Sort only on the client data (with Backbone sort)
 3) Use isotope for visual sorting purely on the client data

After analyzing the result sets from jsonp calls and different options:
	a) Too many matches, even if we specify a min_price and max_price
	b) There's an option for querying with a score/down criteria (most popular).
	c) We can also query by price and created time. Querying by price is useless since we get so many matches even with a single price (same min_price/max_price)

Conclusion: we want to query the most popular items (using the score sorting on the server).

We can still do client-side sorting based on title, price, categories.

