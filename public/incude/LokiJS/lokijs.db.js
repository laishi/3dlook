
// 创建一个数据库，你需要给他一个文件（supermarket.json）以便通过文件名保存数据。
var db = new loki('supermarket.json');

// 然后你可以开始创建一个集合了，假如你不太方便理解集合的概念的话，你可以把数据库想象成一个超市，
// 那么， 集合就是商品的分类了。 如果还没懂， 我就要骂人了， 或者继续往下看。

var fruit = db.addCollection('fruit');

// 因为我们搞的是无本生意，水果架上还没有东西，先从果农哪里进点便宜水果，赚大钱。



fruit.insert({ name: 'apple', place: 'xian', num: '520', pice: '38' });
fruit.insert({ name: 'banana', place: 'hainan', num: '200', pice: '25' });
fruit.insert({ name: 'pear', place: 'chongqing', num: '350', pice: '18' });


console.log(fruit.data);


// 这里我们搞到了三种水果，苹果、香蕉、梨，这三种东西相当于三篇文档。

// 至此，把概念强化一下，不然今后搞数据库容易昏脑壳。
// 数据库（超市）里面放集合（水果），一个数据库可以放N个集合。一个集合可以放N篇文档（苹果、香蕉、梨），文档就存放在集合里。
// 现在我们的生意可以开张了。

// 从实战出发，今天小习有空来我们的超市
// 买苹果，5斤


var findApple = fruit.findOne({ 'name': 'apple' });





// write some function

function bill(name, num) {

	var name = name;
	var num = num;

	var findCommodity = fruit.findOne({ 'name': name });





	if (findCommodity) {

		console.log("yes");

		var commodityName = findCommodity.name;
		var commodityNum  = findCommodity.num;
		var commodityPice = findCommodity.pice;

		var count;


		if ( commodityNum < num ) {
			alert("商品卖完了哦")
		} else {

			$(".buyCont").children().remove();

			count = num * commodityPice;
	
			var buyCont = "<h3>请确认你的账单信息：</h3>" + " " + "<h5>你卖的商品是：</h5>" + " " + commodityName + "<h5>价格是：</h5>" + " " + count + "<h3>感谢你的光顾</h3>"         

			$(".buyCont").append(buyCont);
		}

	} 


	if (findCommodity === null) {

		alert("没有这个商品")

		console.log("no");

	} else {

	}

}





new Vue({

  el: '#buy',
  data: {
    message: '商品名'
  },
  methods: {


    buy: function () {


		console.log(this.message)

		if (this.message) {

			bill(this.message, 10);
			
		}
    }
  }
  
})