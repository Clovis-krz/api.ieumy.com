# api.ieumy.com
## Author: Clovis Krzyzanowski

Ieumy is a website to order and pay food in a restaurant from a QR code, don't wait to order !
api.ieumy.com is the backend part of the App, composed of an API.

Unfinished project ended in september 2022
---------
## Tools:

### Technologies :
- Node JS
- postgresql
--------
### Libraries :
- Express
- pg (posgresql)
- bcrypt
- JsonWebToken

---------
## Lauch the App :
Clone the repository :
```console
$ git clone ssh://git@krzyzanowski.fr:9010/clovis/api.ieumy.com.git
```
Enter the repository :
```console
$ cd api.ieumy.com
```
Create an image folder :
```console
$ mkdir images
```
Enter the images repository :
```console
$ cd images
```
Create an item directory :
```console
$ mkdir items
```
Create a restaurant directory :
```console
$ mkdir restaurants
```
Go back to the root of the repository :
```console
$ cd ..
```
Launch the server :
```console
$ node server
```
-------
## ROUTES:

### Restaurants routes :

#### Get a Restaurant (customers and not authentificated, restaurant need an attached subscription) :
```console
GET http://localhost:3000/api/restaurants?id=[restaurant-id]&table_nb=[table-nb]
```

#### Get my Restaurant (owners) :
```console
GET http://localhost:3000/api/restaurants/my
```
with headers :
```console
{
    "authorization": [jwt token],
}
```

#### Get stripe_account link for my Restaurant (owners, need a subscription) :
```console
GET http://localhost:3000/api/restaurants/my/stripe-account
```
with body :
```console
{
    "restaurant": [restaurant_id],
}
```
and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Create a Restaurant (owners) :
```console
POST http://localhost:3000/api/restaurants
```
 with body :
```console
{
    "name": "",
    "description": "",
    "image": [restaurant image file],
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update my Restaurant (owners, need a subscription) :
```console
PUT http://localhost:3000/api/restaurants
```
 with body :
```console
{
    "restaurant": [resto_id],
    "name": "",
    "description": "",
    "image": [restaurant image file] (if no image update then forget this field),
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```
#### Update my Menu (owners, need a subscription) :
```console
PUT http://localhost:3000/api/restaurants/menu
```
 with body :
```console
{
    "restaurant": [resto_id],
    "categories": "",
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Add category to Menu (owners, need a subscription) :
```console
POST http://localhost:3000/api/restaurants/menu/category
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Rename a category in Menu (owners, need a subscription) :
```console
PUT http://localhost:3000/api/restaurants/menu/category
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "new_category_name": [new_category_name]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Delete a category from Menu (owners, need a subscription) :
```console
DELETE http://localhost:3000/api/restaurants/menu/category
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Add item to Menu (owners, need a subscription) :
```console
POST http://localhost:3000/api/restaurants/menu/item
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "name": [item_name],
    "description": [item_description],
    "price": [item_price],
    "image": [item_image (file)]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update item in Menu (owners, need a subscription) :
```console
PUT http://localhost:3000/api/restaurants/menu/item
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "id": [item_id],
    "name": [item_name],
    "description": [item_description],
    "price": [item_price],
    "image": [item_image (file)] (only if update picture otherwise no image field)
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Delete item from Menu (owners, need a subscription) :
```console
DELETE http://localhost:3000/api/restaurants/menu/item
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "id": [item_id]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Add Variation to item in Menu (owners, need a subscription) :
```console
POST http://localhost:3000/api/restaurants/menu/item/variation
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "item_id": [item_id],
    "name": [item_name],
    "price_delta": [price_delta with original item]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update Variation item in Menu (owners, need a subscription) :
```console
PUT http://localhost:3000/api/restaurants/menu/item/variation
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "item_id": [item_id],
    "name": [current item_name],
    "new_name": [new item_name],
    "price_delta": [new price_delta with original item]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Delete Variation item from Menu (owners, need a subscription) :
```console
DELETE http://localhost:3000/api/restaurants/menu/item/variation
```
 with body :
```console
{
    "restaurant": [resto_id],
    "category_name": [category_name],
    "item_id": [item_id],
    "name": [item_name],
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

### Owners routes :

#### Register :
```console
POST http://localhost:3000/api/owners
```
with body :
```console
{
    "email": "",
    "firstname": "",
    "lastname": "",
    "password": ""
}
```
#### Confirm Account :
```console
GET http://localhost:3000/api/owners/confirm-account?token=[token]
```

#### Login :
```console
POST http://localhost:3000/api/owners/login
```
with body :
```console
{
    "email": "",
    "password": ""
}
```

#### Update (lastname, firstname) :
```console
PUT http://localhost:3000/api/owners
```
with body :
```console
{
    "firstname": "",
    "lastname": "",
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update password :
```console
PUT http://localhost:3000/api/owners/password
```
with body :
```console
{
    "email": "",
    "password": "",
    "new_password": [new_password]
}
```

#### Update email :
```console
PUT http://localhost:3000/api/owners/email
```
with body :
```console
{
    "new_email": [new_email_address]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Confirm Update email :
```console
GET http://localhost:3000/api/owners/confirm-email?token=[token]
```

#### Delete :
Also delete restaurant, orders and subcriptions
```console
DELETE http://localhost:3000/api/owners
```
 with headers :
```console
{
    "authorization": [jwt token],
}
```
### Customers routes :

#### Register :
```console
POST http://localhost:3000/api/customers
```
with body :
```console
{
    "email": "",
    "firstname": "",
    "lastname": "",
    "password": "",
    "address": ""
}
```

#### Confirm Account :
```console
GET http://localhost:3000/api/customers/confirm-account?token=[token]
```

#### Login :
```console
POST http://localhost:3000/api/customers/login
```
with body :
```console
{
    "email": "",
    "password": ""
}
```

#### Update (lastname, firstname, address) :
```console
PUT http://localhost:3000/api/customers
```
with body :
```console
{
    "firstname": "",
    "lastname": "",
    "address": ""
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update password :
```console
PUT http://localhost:3000/api/customers/password
```
with body :
```console
{
    "email": "",
    "password": "",
    "new_password": ""
}
```

#### Update email :
```console
PUT http://localhost:3000/api/customers/email
```
with body :
```console
{
    "new_email": [new_email]
}
```
and headers :
```console
{
    "authorization": [jwt token]
}
```

#### Confirm update email :
```console
GET http://localhost:3000/api/customers/confirm-email?token=[token]
```

#### Delete :
```console
DELETE http://localhost:3000/api/customers
```
 with headers :
```console
{
    "authorization": [jwt token]
}
```
### Orders routes :

an order status is either : "pending", "payed", "served" or "cancelled"
when order is served or cancelled, it is not possible to update is anymore and a end_time is given.
An order will never be visible by the restaurant owner as long as the order is not at least payed.
The pending status is only visible for the backend to handle the payment processing. An order that not payed
within an hour is automatically deleted from the database.

#### Create an order :
```console
POST http://localhost:3000/api/orders
```
with body :
```console
{
    "lastname": "", //only for logged out customers
    "firstname": "", //only for logged out customers
    "email": "", //only for logged out customers
    "items": [item],
    "resto_id": [restaurant_id],
    "table_nb": [table_nb]
}
```
 and headers (optional: only for logged in customers) :
```console
{
    "authorization": [jwt token],
}
```
item example (without variation) :
```console
{
    "id": 0,
    "name": "Oeuf mimosa",
    "variation": null,
    "price": 4,
    "qty": 11
}
```

item example (with variation) :
```console
{
    "id": 7,
    "name": "Choux chantilly",
    "description": "magnifique choux chantilly préparé par un vrai chef",
    "variation": {
        "name": "nappage choco",
        "price_delta": 0.5
    },
    "qty": 1
}
```

#### Get my order (for customers) :
```console
GET http://localhost:3000/api/orders/my
```
with body :
```console
{
    "restaurant": [restaurant_id],
    "id": [order_id]
}
```

#### Get orders ("payed", "served" or "cancelled") (for restaurant owners and employees) :
```console
GET http://localhost:3000/api/orders
```
with body :
```console
{
    "restaurant": [restaurant_id]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Get payed orders (for restaurant owners and employees) :
```console
GET http://localhost:3000/api/orders/payed
```
with body :
```console
{
    "restaurant": [restaurant_id]
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update order to served :
```console
PUT http://localhost:3000/api/orders/update/served
```
with body :
```console
{
    "restaurant": [restaurant_id],
    "order_id": ""
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Update order to cancelled :
```console
PUT http://localhost:3000/api/orders/update/cancelled
```
with body :
```console
{
    "restaurant": [restaurant_id],
    "order_id": ""
}
```
 and headers :
```console
{
    "authorization": [jwt token],
}
```

### Subscriptions routes :

#### Get Actual subscription (for owners) :
```console
GET http://localhost:3000/api/subscriptions/current
```
with body :
```console
{
    "restaurant": [restaurant_id]
}
```
and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Create a new subscription (for owners) :
```console
POST http://localhost:3000/api/subscriptions/new
```
with body :
```console
{
    "restaurant": [restaurant_id],
    "table_amount": [number of tables in subscription]
}
```
and headers :
```console
{
    "authorization": [jwt token],
}
```

#### Get Portal link to manage subscriptions (for owners) :
```console
GET http://localhost:3000/api/subscriptions/manage-link
```
with headers :
```console
{
    "authorization": [jwt token],
}
```

#### Webhooks a (for stripe) :

Update Payment status (to payed or failed) : if payed then updates in database and becomes visible for restaurant owner
otherwise if failed then the order is deleted from the database
```console
POST http://localhost:3000/api/webhooks/stripe/payment-status
```

Update Subscription Payment status (to pending or payed): if payed then subscription becomes active for 30 days, otherwise subscription is not active.
Renew Subscription when paid: when triggered take last active subscription of owner and renew it for 30 days.
Send Email to owner when subscription payment failed and warn that after the deadline, service won't be provided anymore
```console
POST http://localhost:3000/api/webhooks/stripe/subscription-status
```
