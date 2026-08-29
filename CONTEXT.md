# Storefront Backend

REST API backing an online storefront: browsing products, placing and tracking orders, and user accounts.

## Language

**User**:
An account holder identified by a unique `username`, authenticated via `username` + `password`. Distinct from a `Customer` in a general e-commerce sense — here there is only one account type (no separate admin/customer roles).
_Avoid_: Account, customer

**Token**:
A JWT issued at user creation (`POST /users`), embedding the user's identity. Required on protected routes via `Authorization: Bearer <token>`. There is no separate login/authenticate endpoint — the token is only minted once, at signup.
_Avoid_: Session, auth key

**Product**:
An item available for purchase, with a name, price, and `category`. Not order-specific — the same `Product` row is referenced by many orders. "Top 5 most popular products" is explicitly out of scope; "Products by category" is in scope.

**Order**:
A cart-like collection of products tied to one `User`, with a `status` of `active` or `complete`. Only one `active` order exists per user at a time (their "current" order), enforced at the application level (not a DB constraint). Adding a product when no `active` order exists auto-creates one; the response signals this so the frontend can inform the user. Completion (`active` → `complete`) is a one-way transition via a dedicated endpoint, and is rejected if the order has no `order_products`.
_Avoid_: Cart, purchase

**Order Product**:
The quantity of a specific `Product` within a specific `Order` (join table `order_products`, `quantity > 0` enforced at the database level). Not a standalone concept the frontend interacts with directly — it's surfaced as part of the `Order`.
_Avoid_: Line item, order item
