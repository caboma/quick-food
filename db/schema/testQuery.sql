
SELECT full_order.name,full_order.order_id,SUM(price_cents) AS total_price
FROM(SELECT * FROM order_details
JOIN products ON product_id = products.id
where order_id = 1) AS full_order
GROUP BY full_order.order_id,full_order.name;

