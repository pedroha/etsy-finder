var Product = Backbone.Model.extend({
    defaults: {
        id: 0
      , title: ''
      , category: ''
      , description: ''
      , price: ''
      , currency_code: ''
    }
});

Backbone.sync = function(method, model, options) {
    // do nothing!
};

var ProductView = Backbone.View.extend({
    tagName: 'li'
  , productTpl: _.template( $('#product-template').html() )
  , events: {
        'click button.delete': 'remove'
    }
  , initialize: function() {
        _.bindAll(this, 'remove', 'unrender');

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'remove', this.unrender);
  }
  , render: function() {
    var json = this.model.toJSON();
    var content = this.productTpl( json );
    this.$el.html( content );
    return this;
  }
  , unrender: function() {
    $(this.el).remove();
  }
  , remove: function() {
    this.model.destroy();
  }
});

// Test collection of multiple products


// http://stackoverflow.com/questions/5013819/reverse-sort-order-with-backbone-js

var SortedCollection = Backbone.Collection.extend({

   initialize: function () {
       // Default sort field and direction
       this.sortField = "title";
       this.sortDirection = "ASC";
       this.caseSensitive = true;
   },

   setSortField: function (field, direction) {
       this.sortField = field;
       this.sortDirection = direction;
   },

   comparator: function (m) {
       return m.get(this.sortField);
   },

   // Overriding sortBy (copied from underscore and just swapping left and right for reverse sort)
   sortBy: function (iterator, context) {
       var obj = this.models,
           direction = this.sortDirection;

       var self = this;

       return _.pluck(_.map(obj, function (value, index, list) {
           return {
               value: value,
               index: index,
               criteria: iterator.call(context, value, index, list)
           };
       }).sort(function (left, right) {
           // swap a and b for reverse sort
           var a = direction === "ASC" ? left.criteria : right.criteria,
               b = direction === "ASC" ? right.criteria : left.criteria;

           if (a !== b) {
               if (!self.caseSensitive) {
                   if (typeof a === "string" && typeof b === "string") {
                       a = a.toLowerCase();
                       b = b.toLowerCase();                    
                   }
               }
               if (a > b || a === void 0) return 1;
               if (a < b || b === void 0) return -1;
           }
           return left.index < right.index ? -1 : 1;
       }), 'value');
   }
});

var ProductListing = SortedCollection.extend({
    model: Product
  , fetch: function(options) { // override default fetch to use our Ajax version
        var self = this;

        var productTransformer = function(product) {
            var p = product;

            var item = {
                id: p.listing_id
              , title: p.title
              , category: p.category_path.join("/")
              , description: p.description
              , price: parseFloat(p.price)
              , currency_code: p.currency_code
            };

            if (p.images && p.images.length > 0) {
                var img = p.images[0];
                item['image_medium']   = img['url_170x135'];
                item['image_large'] = img['url_fullxfull'];
            }
            return item;
        }

        var deferred = EtsySearch.find(options);
        deferred.done(function(etsyProducts) {
            var products = _.map(etsyProducts, productTransformer);

            self.reset(products);
        });
        return deferred;
    }
});

var ProductListingView = Backbone.View.extend({
    el: $('#product-list')
  , $list: $('ul', this.el)
  , events: {
    }
  , initialize: function() {
        this.collection = new ProductListing();
        this.listenTo(this.collection, 'add', this.appendItem);
        this.listenTo(this.collection, 'reset', this.render);
        this.render();
    }
  , render: function() {
        var self = this;

        this.collection.sort();
        
        this.$list.empty();

        var cnt = 0;
        _(this.collection.models).each(function(item) {
            self.appendItem(item);
            console.log(cnt++, item.attributes);
        }, this);
        return this;
    }
  , appendItem: function(item) {
        var v = new ProductView({
            model: item
        });
        this.$list.append(v.render().el);            
    }
});


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

  	if (id) {
  		alert("We need to show Product " + id);
  	}
  	else {
  		alert("Showing... " + keywords + " " + sort_field + " / " + sort_dir);
  	}

  	// SORT Dilemma: several options
  	// 1) Requery with new sort options back to the server (better data with sorting)
  	// 2) Sort only on the client data (with Backbone sort)
  	// 3) Use isotope for visual sorting purely on the client data

  	// For simplicity and accuracy, 1) requery the server?

  }
});

