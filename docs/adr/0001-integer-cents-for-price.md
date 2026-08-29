# Store product price as integer cents

`products.price` is stored as `INTEGER` cents (e.g. `999` = $9.99) rather than `NUMERIC(10,2)` dollars. This avoids floating-point/rounding pitfalls and keeps arithmetic (order totals) exact using plain integer math. The frontend is responsible for formatting cents into a displayed currency string.
