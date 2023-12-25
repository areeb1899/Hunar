const Listing=require('../models/Product');

const fakeListing=[{
    name:"Shimla,In",
     description:"cloth",
    image:"https://static.toiimg.com/photo/msid-102383896,width-96,height-65.cms",
    price:9384
},{
    name:"Ooty,In",
     description:"cloth",
    image:"https://www.tamilnadutourism.tn.gov.in/img/pages/medium-desktop/ooty-1655457424_bca80f81e8391ebdaaca.webp",
    price:2345
},{
    name:"Kerala,In",
     description:"cloth",
    image:"https://traveldudes.com/wp-content/uploads/2020/09/Kerala_Main.jpg",
    price:1245
}]

async function seedProducts() {
    await Listing.deleteMany({});
    await Listing.insertMany(fakeListing);
    console.log('db seeded');
  }

module.exports=seedProducts;