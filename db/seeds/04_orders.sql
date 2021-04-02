/*
INSERT INTO orders(user_id, product_id, sub_total, tax_rate, delivery_fee, total_price) VALUES (1,ARRAY [1,1],800,113,150,1100);
INSERT INTO orders(user_id, product_id, sub_total, tax_rate, delivery_fee, total_price) VALUES (2,ARRAY [2,2],700,114,150,1200);
INSERT INTO orders(user_id, product_id, sub_total, tax_rate, delivery_fee, total_price) VALUES (3,ARRAY [3,1],600,115,150,1300);
*/

INSERT INTO orders(id, user_id, restaurant_id, ready_for_pickup, fulfilled)
VALUES (1, 1, 1, FALSE, FALSE)
