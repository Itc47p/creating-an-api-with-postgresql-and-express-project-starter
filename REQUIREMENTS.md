# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index — `GET /products`
- Show — `GET /products/:id`
- Create [token required] — `POST /products`
- Products by category (args: product category) — `GET /products/category/:category`

#### Users
- Index [token required] — `GET /users`
- Show [token required] — `GET /users/:id`
- Create [token required] — `POST /users` (returns a JWT for the new user; no separate login endpoint)

#### Orders

- Current Order by user (args: user id) [token required] — `GET /orders/current/:userId`
- Completed Orders by user (args: user id) [token required] — `GET /orders/completed/:userId`
- Add product to order (args: user id, product id, quantity) [token required] — `POST /orders/:userId/products` (auto-creates the user's active order if none exists; response flags this)
- Complete order (args: order id) [token required] — `PATCH /orders/:id/complete` (rejected if the order has no products)

## Data Shapes

#### Product

- id
- name
- price (integer, cents)
- category

#### User

- id
- username
- firstName
- lastName
- password (bcrypt hash, never returned in responses)

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Schema

---

users (id SERIAL PK, username VARCHAR UNIQUE, firstName VARCHAR, lastName VARCHAR, password VARCHAR)
products (id SERIAL PK, name VARCHAR, price INTEGER, category VARCHAR)
orders (id SERIAL PK, user_id INTEGER [FK -> users.id], status VARCHAR)
order_products (id SERIAL PK, order_id INTEGER [FK -> orders.id], product_id INTEGER [FK -> products.id], quantity INTEGER)

---
