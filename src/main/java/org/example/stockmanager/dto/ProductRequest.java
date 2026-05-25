package org.example.stockmanager.dto;

import jakarta.validation.constraints.*;

public class ProductRequest {

    @NotBlank(message = "Ürün adı boş bırakılamaz!")
    @Size(min = 2, max = 100, message = "Ürün adı 2 ile 100 karakter arasında olmalıdır!")
    private String name;

    @NotBlank(message = "Kategori boş bırakılamaz!")
    private String category;

    @Min(value = 0, message = "Stok miktarı 0'dan küçük olamaz!")
    private int stock;

    @DecimalMin(value = "0.0", inclusive = false, message = "Fiyat 0'dan büyük olmalıdır!")
    private double price;

    public ProductRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
