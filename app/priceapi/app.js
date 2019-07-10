var express = require("express");
var app = express();
var ebay = require('ebay-api');

//Creating Router() object

var router = express.Router();

// Router middleware, mentioned it before defining routes.

router.use(function(req,res,next) {
  console.log("/" + req.method);
  next();
});

// Provide all routes here, this is for Home page.

router.get("/*",function(req,res){

  productName = req.params[0];

  var params = {
  keywords: [productName],

  // add additional fields
  outputSelector: ['UnitPriceInfo'],

  paginationInput: {
    entriesPerPage: 25
  },

  itemFilter: [
    {name: 'FreeShippingOnly', value: true},
  ],


};

  ebay.xmlRequest({
      serviceName: 'Finding',
      opType: 'findItemsByKeywords',
      appId: '',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
      params: params,
      parser: ebay.parseResponseJson    // (default)
    },
    // gets all the items together in a merged array
    function itemsCallback(error, itemsResponse) {
      if (error) throw error;

      var items = itemsResponse.searchResult.item;
      var currencyId
      var categoryName
      var prices = []
      var totalPrice = 0
      //console.log(items)

      // res.json({
      //   "category" : items.primaryCategory.categoryName,
      //   "price" : items.sellingStatus.currentPrice.amount,
      //   "currency" : items.sellingStatus.currentPrice.currencyId});

      if (items !== undefined){

      console.log('Found', items.length, 'items');

      for (var i = 0; i < items.length; i++) {
        //console.log('- ' + items[i].title);
        //console.log('-- ' + items[i].sellingStatus.currentPrice.amount + ' ' + items[i].sellingStatus.currentPrice.currencyId);
        //console.log('-- ' + items[i].primaryCategory.categoryName);
        prices.push (items[i].sellingStatus.currentPrice.amount)
        totalPrice += items[i].sellingStatus.currentPrice.amount
        currencyId = items[i].sellingStatus.currentPrice.currencyId
        categoryName = items[i].primaryCategory.categoryName


      }

      res.json({
        "category" : categoryName,
        "avgPrice" : Number(Number(totalPrice / items.length).toFixed(2)),
        "medianPrice" : Number(Number(median(prices)).toFixed(2)),
        "minPrice" : Math.min.apply(Math,prices),
        "maxPrice" : Math.max.apply(Math,prices),
        "currency" : currencyId});

}else{
  res.json({
    "category" : 'not found'});

}

    }
  );


});

// Tell express to use this router with /api before.
// You can put just '/' if you don't want any sub path before routes.

app.use("/price",router);

// Listen to this Port

app.listen(8080,function(){
  console.log("Live at http://localhost:8080/price/{YOUR SEARCH STRING}");
});

/////////////////////

function median(arr){
  arr = arr.sort(function(a, b){ return a - b; });
  var i = arr.length / 2;
  return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
}
