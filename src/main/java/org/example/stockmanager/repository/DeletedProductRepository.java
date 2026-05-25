package org.example.stockmanager.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.example.stockmanager.entity.DeletedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeletedProductRepository extends JpaRepository<DeletedProduct, Long> {

    List<DeletedProduct> findAllByDeletedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("select d from DeletedProduct d where month(d.deletedAt) = :month")
    List<DeletedProduct> findByDeletedAtMonth(@Param("month") int month);
}
