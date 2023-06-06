require('dotenv').config();
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const db = require('../db/restaurants.js');
const db_owner = require('../db/owners.js');
const { resolvePtr } = require('dns');

exports.getOne = async (req, res, next) => {
    const resto_id = req.query.id;
    try {
      var resto = await db.getRestaurants(resto_id);
      var response_data = {
        id: resto.id,
        name: resto.name,
        description: resto.description,
        image: resto.image,
        categories: resto.categories
      }
      res.status(200).json({
        data: response_data
      })
    } catch (error) {
      res.status(404).json({message: "not found"})
    }
    
};

exports.getMy = async (req, res, next) => {
  const owner_id = req.auth.userId;
  try {
    var owner_data = await db_owner.getOwner(owner_id);
    var resto = await db.getRestaurants(owner_data.restaurant);
    res.status(200).json({
      data: resto
    })
  } catch (error) {
    res.status(404).json({message: "not found"})
  }
  
};

exports.getStripeAccount = async (req, res, next) => {
  var restaurant = req.body;
  try{
    var resto_data = await db.getRestaurants(restaurant.restaurant);
    const accountLink = await stripe.accountLinks.create({
      account: resto_data.stripe_account,
      refresh_url: 'https://ieumy.com/reauth',
      return_url: 'https://ieumy.com/return',
      type: 'account_onboarding',
    });
    res.status(200).json({
      message: "success",
      data: accountLink
    })
  }catch (err){
    res.status(500).json({
      message: "cannot get restaurant stripe account",
    })
  }
};

exports.createRestaurant = async (req, res, next) => {
  var resto = req.restaurant;
  try {
    resto.image = req.file_url;
    const stripe_account = await stripe.accounts.create({type: 'standard'});
    resto.stripe_account = stripe_account.id;
    var result = await db.createRestaurants(resto);
    await db_owner.attachRestaurant(req.auth.userId, result.rows[0].id);
    var res_resto = {
      restaurant_id: result.rows[0].id,
    }
    res.status(200).json({
      data: res_resto,
    })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
  
}

exports.updateRestaurant = async (req, res, next) => {
  var resto = req.restaurant;
  try {
    var resto_data = await db.getRestaurants(resto.restaurant);
    if (req.file_url == null) {
      resto.image = resto_data.image;
    } else{
      resto.image = req.file_url;
      var file_name = resto_data.image.split('/')[resto_data.image.split('/').length - 1];
      DeleteImage("./images/restaurants/"+req.auth.userId+"/"+file_name);
    }
    await db.updateRestaurants(resto.restaurant, resto);
    res.status(200).json({
      message: "success",
    })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
  
}

exports.updateMenu = async (req, res, next) => {
  var resto = req.body;
  try {
    await db.updateMenu(resto.restaurant, resto);
    res.status(200).json({
      message: "success",
    })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
  
}

exports.AddCategoryMenu = async (req, res, next) => {
  var resto = req.body;
  try {
    var resto_data = await db.getRestaurants(resto.restaurant);
    if (resto_data.categories[resto.category_name]) {
      res.status(400).json({message: "this category already exist"});
    } else {
      resto_data.categories[resto.category_name] = [];
      await db.updateMenu(resto.restaurant, resto_data);
      res.status(200).json({message: "success"});
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

exports.UpdateCategoryMenu = async (req, res, next) => {
  var resto = req.body;
  try {
    var resto_data = await db.getRestaurants(resto.restaurant);
    if (!resto_data.categories[resto.category_name] || resto_data.categories[resto.new_category_name]) {
      res.status(400).json({message: "this category does not exist or new category name already exist"});
    } else {
      resto_data.categories[resto.new_category_name] = resto_data.categories[resto.category_name];
      delete resto_data.categories[resto.category_name];
      console.log(resto_data.categories);
      await db.updateMenu(resto.restaurant, resto_data);
      res.status(200).json({message: "success"});
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

exports.DeleteCategoryMenu = async (req, res, next) => {
  var resto = req.body;
  try {
    var resto_data = await db.getRestaurants(resto.restaurant);
    if (!resto_data.categories[resto.category_name]) {
      res.status(400).json({message: "this category does not exist"});
    } else {
      delete resto_data.categories[resto.category_name];
      await db.updateMenu(resto.restaurant, resto_data);
      res.status(200).json({message: "success"});
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

exports.AddItemMenu = async (req, res, next) => {
  var resto = req.item;
  try {
    if (!resto.name || !resto.description || !resto.price || !resto.category_name || !resto.restaurant) {
      res.status(400).json({message: "this category does not exist"});
    } else {
      var resto_data = await db.getRestaurants(resto.restaurant);
      var item_id = FindMaxIdMenu(resto_data.categories) + 1;
      var new_item = {
        id: Number(item_id),
        name: resto.name,
        description: resto.description,
        image: req.file_url,
        variations: [],
        price: Number(resto.price),
      }
      resto_data.categories[resto.category_name].push(new_item);
      await db.updateMenu(resto.restaurant, resto_data);
      res.status(200).json({message: "success"});
    }
  } catch (error) {
    res.status(500).json({
      message: "cannot add item",
    })
  }
}

exports.UpdateItemMenu = async (req, res, next) => {
  var item = req.item;
  try {
    if (!item.name || !item.description || !item.price || !item.category_name || !item.restaurant || !item.id) {
      res.status(400).json({message: "missing fields"});
    } else {
      var resto_data = await db.getRestaurants(item.restaurant);
      var item_index = FindItemIndexMenu(resto_data.categories[item.category_name], item.id);
      if (item_index < 0) {
        res.status(404).json({message: "item to update not found"});
      } else {
        resto_data.categories[item.category_name][item_index].name = item.name;
        resto_data.categories[item.category_name][item_index].description = item.description;
        resto_data.categories[item.category_name][item_index].price = Number(item.price);
        if (req.file_url != null) {
          var item_data = resto_data.categories[item.category_name][item_index];
          var file_name = item_data.image.split('/')[item_data.image.split('/').length - 1];
          DeleteImage("./images/items/"+req.auth.userId+"/"+file_name);
          resto_data.categories[item.category_name][item_index].image = req.file_url;
        }
        await db.updateMenu(item.restaurant, resto_data);
        res.status(200).json({message: "success"});
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "cannot update item",
    })
  }
}

exports.DeleteItemMenu = async (req, res, next) => {
  var item = req.body;
  try {
    if ( !item.category_name || !item.restaurant || !item.id) {
      res.status(400).json({message: "missing fields"});
    } else {
      var resto_data = await db.getRestaurants(item.restaurant);
      var item_index = FindItemIndexMenu(resto_data.categories[item.category_name], item.id);
      if (item_index < 0) {
        res.status(404).json({message: "item to delete not found"});
      } else {
        var item_data = resto_data.categories[item.category_name][item_index];
        resto_data.categories[item.category_name].splice(item_index, 1);
        var file_name = item_data.image.split('/')[item_data.image.split('/').length - 1];
        DeleteImage("./images/items/"+req.auth.userId+"/"+file_name);
        await db.updateMenu(item.restaurant, resto_data);
        res.status(200).json({message: "success"});
      }
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

exports.AddVariationItem = async (req, res, next) => {
  var variation = req.body;
  try {
    if (!variation.name || !variation.price_delta || !variation.category_name || !variation.restaurant || !variation.item_id) {
      res.status(400).json({message: "missing fields"});
    } else {
      var resto_data = await db.getRestaurants(variation.restaurant);
      var item_index = FindItemIndexMenu(resto_data.categories[variation.category_name], variation.item_id);
      if (item_index < 0) {
        res.status(404).json({message: "item variation to add not found"});
      } else {
        var new_variation = {
          name: variation.name,
          price_delta: variation.price_delta
        }
        var found_variation = false;
        for (const variation_index in resto_data.categories[variation.category_name][item_index].variations) {
          if (resto_data.categories[variation.category_name][item_index].variations[variation_index].name == variation.name) {
            found_variation = true;
          }
        }
        if (!found_variation) {
          resto_data.categories[variation.category_name][item_index].variations.push(new_variation);
          await db.updateMenu(variation.restaurant, resto_data);
          res.status(200).json({message: "success"});
        } else {
          res.status(400).json({message: "variation already exist"});
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "cannot add item variation",
    })
  }
}

exports.UpdateVariationItem = async (req, res, next) => {
  var variation = req.body;
  try {
    if (!variation.name || !variation.new_name || !variation.price_delta || !variation.category_name || !variation.restaurant || !variation.item_id) {
      res.status(400).json({message: "missing fields"});
    } else {
      var resto_data = await db.getRestaurants(variation.restaurant);
      var item_index = FindItemIndexMenu(resto_data.categories[variation.category_name], variation.item_id);
      if (item_index < 0) {
        res.status(404).json({message: "item variation to add not found"});
      } else {
        var variation_index = FindVariationIndex(resto_data.categories[variation.category_name][item_index].variations, variation.name);
        if (variation_index >= 0) {
          resto_data.categories[variation.category_name][item_index].variations[variation_index].name = variation.new_name;
          resto_data.categories[variation.category_name][item_index].variations[variation_index].price_delta = variation.price_delta;
          await db.updateMenu(variation.restaurant, resto_data);
          res.status(200).json({message: "success"});
        } else {
          res.status(400).json({message: "The variation to update does not exist"});
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "cannot add item variation",
    })
  }
}

exports.DeleteVariationItem = async (req, res, next) => {
  var variation = req.body;
  try {
    if (!variation.name || !variation.category_name || !variation.restaurant || !variation.item_id) {
      res.status(400).json({message: "missing fields"});
    } else {
      var resto_data = await db.getRestaurants(variation.restaurant);
      var item_index = FindItemIndexMenu(resto_data.categories[variation.category_name], variation.item_id);
      if (item_index < 0) {
        res.status(404).json({message: "item variation to delete not found"});
      } else {
        var variation_index = FindVariationIndex(resto_data.categories[variation.category_name][item_index].variations, variation.name);
        if (variation_index >= 0) {
          resto_data.categories[variation.category_name][item_index].variations.splice(variation_index, 1);
          await db.updateMenu(variation.restaurant, resto_data);
          res.status(200).json({message: "success"});
        } else {
          res.status(400).json({message: "The variation to delete does not exist"});
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "cannot delete item variation",
    })
  }
}

function FindMaxIdMenu(menu){
  var maxId = 0;
  for (const category in menu) {
    for (const item in menu[category]) {
      if (menu[category][item].id > maxId) {
        maxId = menu[category][item].id;
      }
    }
  }
  return maxId;
}

function FindItemIndexMenu(category, item_id){
  //IF index = -1 then not found
  var index = -1;
  for (const item in category) {
    if (category[item].id == item_id) {
      var index = item;
    }
  }
  return index;
}

function FindVariationIndex(variations, variation_name){
  //IF index = -1 then not found
  var index = -1;
  for (const variation in variations) {
    if (variations[variation].name == variation_name) {
      var index = variation;
    }
  }
  return index;
}

function DeleteImage(path){
  fs.unlink(path, (result, err) => {
    if (err) {
      return new Error('cannot delete image');
    }
    else{
        if (result != null && result.errno == -2) {
          return new Error('image not found');
        }
    }
  })
}

