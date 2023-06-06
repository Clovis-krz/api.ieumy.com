const multer  = require('multer');
const fs = require('fs');
const image_item_path = './images/items/';
const image_restaurant_path = './images/restaurants/';

const StorageItem = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, image_item_path+req.auth.userId)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
      cb(null, uniqueSuffix + "-" + file.originalname)
    }
});

const StorageResto = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, image_restaurant_path+req.auth.userId)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
      cb(null, uniqueSuffix + "-" + file.originalname)
    }
})

const upload_item = multer({ storage: StorageItem }).single('image');
const upload_resto = multer({ storage: StorageResto }).single('image');

exports.UploadPictureItem = (req, res, next) => {
    try {
        CheckFolder(image_item_path+req.auth.userId);
    } catch (error) {
        res.status(500).json({message: "an error occured while creating owner item image folder"});
    }
    upload_item(req, res, async function (err) {
        if (err) {
          res.status(500).json({message: "an error occured while saving the picture"});
        } else {
            try {
                var temp = req.file.path;
                req.file_url = "http://"+req.headers.host +"/"+temp;
                req.item = req.body;
                next();
            } catch (error) {
                res.status(500).json({message: "an error occured while saving the picture"});
            }
          
        }
    });
}

exports.UploadPictureUpdateItem = (req, res, next) => {
    try {
        CheckFolder(image_item_path+req.auth.userId);
    } catch (error) {
        res.status(500).json({message: "an error occured while creating owner item image folder"});
    }
    upload_item(req, res, async function (err) {
        if (err) {
          res.status(500).json({message: "an error occured while saving the picture updated"});
        } else {
            try {
                var temp = req.file.path;
                req.file_url = "http://"+req.headers.host +"/"+temp;
                req.item = req.body;
                next();
            } catch (error) {
                //IF there is no file saved
                req.item = req.body;
                req.file_url = null;
                next();
            }
        }
    });
}

exports.UploadPictureRestaurant = (req, res, next) => {
    try {
        CheckFolder(image_restaurant_path+req.auth.userId);
    } catch (error) {
        res.status(500).json({message: "an error occured while creating owner restaurant image folder"});
    }
    upload_resto(req, res, async function (err) {
        if (err) {
            console.log(err);
          res.status(500).json({message: "an error occured while saving the restaurant picture"});
        } else {
            try {
                var temp = req.file.path;
                req.file_url = "http://"+req.headers.host +"/"+temp;
                req.restaurant = req.body;
                next();
            } catch (error) {
                res.status(500).json({message: "an error occured while saving the restaurant picture"});
            }
          
        }
    });
}

exports.UploadPictureUpdateRestaurant = (req, res, next) => {
    try {
        CheckFolder(image_restaurant_path+req.auth.userId);
    } catch (error) {
        res.status(500).json({message: "an error occured while creating owner restaurant image folder"});
    }
    upload_resto(req, res, async function (err) {
        if (err) {
          res.status(500).json({message: "an error occured while saving the restaurant picture updated"});
        } else {
            try {
                var temp = req.file.path;
                req.file_url = "http://"+req.headers.host +"/"+temp;
                req.restaurant = req.body;
                next();
            } catch (error) {
                //IF there is no file saved
                req.restaurant = req.body;
                req.file_url = null;
                next();
            }
        }
    });
}

function CheckFolder(path){
    try {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      } catch (err) {
        console.log(err);
        return Error('CheckFolder: impossible to create folder');
      }
}