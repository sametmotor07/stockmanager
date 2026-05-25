CREATE TABLE IF NOT EXISTS product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(255),
    stock INTEGER,
    price DOUBLE
);

CREATE TABLE IF NOT EXISTS deleted_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    name VARCHAR(255),
    category VARCHAR(255),
    stock INTEGER,
    price DOUBLE,
    deleted_at TIMESTAMP
);
