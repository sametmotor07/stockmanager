package org.example.stockmanager.service;

import org.example.stockmanager.dto.ProductRequest;
import org.example.stockmanager.entity.Product;
import org.example.stockmanager.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock());
        product.setPrice(request.getPrice());
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Optional<Product> optional = productRepository.findById(id);

        if (optional.isPresent()) {
            Product existing = optional.get();
            existing.setName(request.getName());
            existing.setCategory(request.getCategory());
            existing.setStock(request.getStock());
            existing.setPrice(request.getPrice());
            return productRepository.save(existing);
        }

        return null;
    }

    public boolean deleteProduct(Long id) {
        Optional<Product> optional = productRepository.findById(id);

        if (optional.isPresent()) {
            productRepository.deleteById(id);
            return true;
        }

        return false;
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getLowStockProducts(int stock) {
        return productRepository.findByStockLessThan(stock);
    }

    public List<Product> getByPriceRange(double minPrice, double maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
}
