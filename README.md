# 📦 Stock Manager - Stok Yönetim Sistemi

Spring Boot ile geliştirilmiş RESTful bir stok yönetim API'sidir.

---

## 🚀 Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|---|---|
| Java 17 | Programlama dili |
| Spring Boot 3.4.5 | Backend framework |
| Spring Data JPA | Veritabanı işlemleri |
| Spring Security | Kimlik doğrulama ve yetkilendirme (RBAC) |
| Spring Validation | Gelen verilerin doğrulanması |
| H2 Database | Geçici bellek içi veritabanı |
| Maven | Bağımlılık yönetimi |

---

## 📁 Proje Yapısı

```
stockmanager/
└── src/main/java/org/example/stockmanager/
    ├── controller/   → HTTP isteklerini karşılar
    ├── service/      → İş mantığı
    ├── repository/   → Veritabanı işlemleri
    ├── entity/       → Veritabanı tabloları
    ├── dto/          → Gelen veri doğrulama
    ├── exception/    → Hata yönetimi
    └── security/     → Spring Security RBAC
```

---

## 👤 Kullanıcı Rolleri (RBAC)

| Kullanıcı | Şifre | Rol | Yetkiler |
|---|---|---|---|
| `admin` | `admin123` | ADMIN | GET, POST, PUT, DELETE |
| `user` | `user123` | USER | Sadece GET |

---

## 🔗 API Endpointleri

### Temel CRUD
| Method | URL | Açıklama | Yetki |
|---|---|---|---|
| GET | `/products` | Tüm ürünleri listele | USER, ADMIN |
| GET | `/products/{id}` | ID ile ürün getir | USER, ADMIN |
| POST | `/products` | Yeni ürün ekle | ADMIN |
| PUT | `/products/{id}` | Ürün güncelle | ADMIN |
| DELETE | `/products/{id}` | Ürün sil | ADMIN |

### Özel Sorgular
| Method | URL | Açıklama | Yetki |
|---|---|---|---|
| GET | `/products/category/{category}` | Kategoriye göre filtrele | USER, ADMIN |
| GET | `/products/low-stock/{stock}` | Stok eşiğin altındakiler | USER, ADMIN |
| GET | `/products/price-range?minPrice=&maxPrice=` | Fiyat aralığına göre filtrele | USER, ADMIN |
| GET | `/products/search?name=` | İsme göre ara | USER, ADMIN |

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler
- Java 17+
- IntelliJ IDEA
- Postman (test için)

### Adımlar

**1. Repoyu klonla:**
```bash
git clone https://github.com/kullanici-adin/stockmanager.git
cd stockmanager
```

**2. IntelliJ IDEA'da aç:**
- `pom.xml` dosyasına sağ tıkla → **Add as Maven Project**

**3. Çalıştır:**
- `StockmanagerApplication.java` dosyasını aç
- Yeşil ▶ butonuna bas

**4. Test et:**
- API: `http://localhost:8080/products`
- H2 Konsol: `http://localhost:8080/h2-console`

---

## 📬 Postman ile Test

POST isteği için Body → raw → JSON:

```json
{
  "name": "Laptop",
  "category": "Elektronik",
  "stock": 50,
  "price": 15000.00
}
```

Postman'de **Authorization → Basic Auth** sekmesinden kullanıcı adı ve şifre gir.

---

## ✅ Validation Kuralları

| Alan | Kural |
|---|---|
| `name` | Boş olamaz, 2-100 karakter |
| `category` | Boş olamaz |
| `stock` | 0'dan küçük olamaz |
| `price` | 0'dan büyük olmalı |
