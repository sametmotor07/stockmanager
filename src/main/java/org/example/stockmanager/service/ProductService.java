package org.example.stockmanager.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.example.stockmanager.dto.ProductRequest;
import org.example.stockmanager.entity.DeletedProduct;
import org.example.stockmanager.entity.Product;
import org.example.stockmanager.repository.DeletedProductRepository;
import org.example.stockmanager.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final DeletedProductRepository deletedProductRepository;

    public ProductService(ProductRepository productRepository, DeletedProductRepository deletedProductRepository) {
        this.productRepository = productRepository;
        this.deletedProductRepository = deletedProductRepository;
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
            Product product = optional.get();
            DeletedProduct deletedProduct = new DeletedProduct();
            deletedProduct.setProductId(product.getId());
            deletedProduct.setName(product.getName());
            deletedProduct.setCategory(product.getCategory());
            deletedProduct.setStock(product.getStock());
            deletedProduct.setPrice(product.getPrice());
            deletedProduct.setDeletedAt(LocalDateTime.now());
            deletedProductRepository.save(deletedProduct);
            productRepository.delete(product);
            return true;
        }

        return false;
    }

    public List<DeletedProduct> getDeletedProducts(Integer year, Integer month) {
        if (year == null && month == null) {
            return deletedProductRepository.findAll();
        }

        if (year == null) {
            return deletedProductRepository.findByDeletedAtMonth(month);
        }

        if (month == null) {
            LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
            LocalDateTime end = start.plusYears(1);
            return deletedProductRepository.findAllByDeletedAtBetween(start, end);
        }

        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1);
        return deletedProductRepository.findAllByDeletedAtBetween(start, end);
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
