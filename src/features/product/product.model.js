
export default class ProductModel{
    constructor(id,name,desc,price,imageUrl,category,sizes){
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
    }

    //function to return single product by id.
    static get(id){
      const product = products.find(p => p.id === id);
      return product;
    }
    
    static GetAll(){
        return products;
    }

    //change the add method for uploaded file
    static add(product){
      //when we are creating a new product, it is server responsibility to generate the id for the product, so we will generate the id by using the length of the products array + 1/ Date.now().
      //when we will be using database, then we will be using the auto-increment feature of the database to generate the id for the product.
      product.id = products.length + 1;
      products.push(product);
      return product;
    }
}

//default export of an array of products.
var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    'category1',
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    'category2',
    ['M', 'XL']
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    'category3',
    ['S', 'M', 'L']
  ),
];