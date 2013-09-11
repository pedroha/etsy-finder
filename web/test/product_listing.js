
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

var products = _.map(etsy_products, productTransformer);

var cnt = 0;

_.each(products, function(p) {
    cnt = (cnt+1) % etsy_product_images.length;
    var img = etsy_product_images[cnt];
    p['image_medium']   = img['url_170x135'];
    p['image_large'] = img['url_fullxfull'];
});

// console.log(products);

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
  , tagClass: 'span4' // Hardcoding for now (for Bootstrap)
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
    if (this.tagClass) {
      this.$el.addClass(this.tagClass);
    }
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
});

var ProductListingView = Backbone.View.extend({
    el: $('#product-list')
  , $list: $('ul', this.el)
  , eltTagName: 'li'
  , eltTagClass: '' // TODO: doesn't seem to work with override
  , events: {
    }
  , initialize: function() {
        this.collection = new ProductListing();
        this.listenTo(this.collection, 'add', this.appendItem);
        this.listenTo(this.collection, 'reset', this.render);
        // this.render();
    }
  , reset: function() {
        this.$list.empty();
  }
  , render: function() {
        var self = this;

        this.collection.sort();

        this.reset();
        
        var cnt = 0;
        _(this.collection.models).each(function(item) {
            self.appendItem(item);
            // console.log(cnt, "ProductListingView", item.attributes);
            cnt++;
        }, this);
        return this;
    }
  , appendItem: function(item, cnt) {
        var v = new ProductView({
            model: item
          , tagName: this.eltTagName
          , tagClass: this.eltTagClass
        });
        this.$list.append(v.render().el);            
    }
});


var ProductRowListingView = ProductListingView.extend({
    initialize: function(options) {
        ProductListingView.prototype.initialize.apply(this, arguments);        
        this.numColsPerRow = options.numColsPerRow || 3; // NEEDS to be up here (-> render())
        this.cnt =  0;
    }
  , reset: function() {
        this.cnt = 0;
        $(this.el).empty();
        // alert("Reset");
    }
  , appendItem: function(item) {
        var v = new ProductView({
            model: item
          , tagName: this.eltTagName
          , tagClass: this.eltTagClass
        });

        var isNewRow = (this.cnt % this.numColsPerRow == 0);
        // console.log("isNewRow", isNewRow, this.cnt, this.numColsPerRow);

        if (isNewRow) {
            $list = $('<ul class="row-fluid"></ul>');
            $list.appendTo(this.el);

            this.$list = $list; // reset current list

            console.log("isNewRow");
        }
        this.$list.append( v.render().el );

        this.cnt++;
    }    
});
