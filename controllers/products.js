const product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  // const search='a'

  //const products=await product.find({}).sort('name price'); // we leave space to add another one in sort function

  //const products=await product.find({}).select('name price'); // .select is used to specify which fields of document want to be returned such as i want him to return only the name and price
  //it write in query in url   ?fields=name,price

  const products = await product
    .find({})
    .select("name price")
    .limit(10) //it will limit the amount of the returned items
    .skip(2); //it will skip some items from the first

  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    //if it existed add it in queryObject
    queryObject.featured = featured === "true" ? true : false;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }; //we use regex for search for names that contain this name
    //without it. it will search for exact name
  }
  if (company) {
    queryObject.company = company;
  }
  if (numericFilters) {
    const opertorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(>|>=|=|<=|<)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${opertorMap[match]}-`);

    console.log(filters); //price-$gt-40,rating-$gt-4

    const options = ["price", "rating"];

    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);

  let result = product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" "); //to replace the comma from query in url with space to put it in the sort function which does not accept comma
    result = result.sort(sortList);
  } else {
    // if the user do not use the sort it will sort products according to createAt property (default)
    result = result.sort("createAt");
  }
  if (fields) {
    const fieldsList = fields.split(",").join(" "); //to replace the comma from query in url with space to put it in the select function which does not accept comma
    result = result.select(fieldsList);
  }

  //this for making multi pages to shw the products
  const page = Number(req.query.page);
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProductsStatic, getAllProducts };
