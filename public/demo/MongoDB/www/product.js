var mongoose = require("mongoose");

//这个Schema有点像工厂里产品的模具。
var Schema = mongoose.Schema;

// 连接字符串格式为mongodb://主机/数据库名

var url = 'mongodb://localhost:3001/3dlook';

// mongoose发起连接
mongoose.connect(url);

//为productSchema配置字段。
var productSchema = new Schema({
    id      : { type: String, unique: true },
    code    : { type: String, required: true, unique: true },
    name    : { type: String, required: true, unique: true },
    size    : { type: String, required: true },
    weight  : { type: String, required: true },
    price   : { type: Number, required: true },
    date    : Date,
    summary : { type: String, required: true },
    image   : { type: String, required: true },
    place   : { type: String, required: true },
})

// 模型

var Product = mongoose.model('Product', productSchema);



//有了模具马上就开始造产品了,并打上'中国造'

var Product = new Product({
    id      : 002,
    code    : 'SY-LED-THD002',
    name    : 'LED天花灯',
    size    : '12cmx12cmx12cm',
    weight  : 0.25,
    price   : 52,
    date    : '2016-6-21',
    summary : 'LED天花灯采用导热性极高的铝合金及专利结构技术设计生产的新型天花灯。 LED天花灯在商业照明领域使用较广,家居照明领域还在慢慢渗透。',
    image   : 'http://c.hiphotos.baidu.com/baike/c0%3Dbaike150%2C5%2C5%2C150%2C50/sign:f6ee7ba3d488d43fe4a499a01c77b97e/4afbfbedab64034f721d1ed0adc379310b551d17.jpg',
    place   : '中国.中山',
})

//保存数据到数据库,注意product将作为集合保存，且会变成products，现在就可以通过 db.products.find()查看文档了。
Product.save(function(err) {
    if (err) {
        console.log('err')
        return;
    }
    console.log('LED天花灯');
});

//上面提到的数据库、集合、文档需要透彻理解。
//如果你不方便理解请按照我的方式来，数据库就相当于一个堆放各种产品的仓库，那么不同的产品名称就是不同的集合名称，产品的属性就相当于文档。
