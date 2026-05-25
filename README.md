Stock Manager - Stok Yönetim Sistemi
Spring Boot ile geliştirilmiş RESTful bir stok yönetim API'sidir.

Kullanılan Teknolojiler
TeknolojiAçıklamaJava 17Programlama diliSpring Boot 3.4.5Backend frameworkSpring Data JPAVeritabanı işlemleriSpring SecurityKimlik doğrulama ve yetkilendirme (RBAC)Spring ValidationGelen verilerin doğrulanmasıH2 DatabaseGeçici bellek içi veritabanıMavenBağımlılık yönetimi

Proje Yapısı
stockmanager/
├── src/main/java/org/example/stockmanager/
│   ├── controller/   → HTTP isteklerini karşılar
│   ├── service/      → İş mantığı
│   ├── repository/   → Veritabanı işlemleri
│   ├── entity/       → Veritabanı tabloları
│   ├── dto/          → Gelen veri doğrulama
│   ├── exception/    → Hata yönetimi
│   ├── security/     → Spring Security RBAC
│   └── StockmanagerApplication.java
└── src/main/resources/
    ├── static/       → Frontend dosyaları (index.html vb.)
    └── application.properties

Kullanıcı Rolleri (RBAC)
KullanıcıŞifreRolYetkilersametsamet07ADMINGET, POST, PUT, DELETEuseruser123USERSadece GET

API Endpointleri
Temel CRUD
MethodURLAçıklamaYetkiGET/productsTüm ürünleri listeleUSER, ADMINGET/products/{id}ID ile ürün getirUSER, ADMINPOST/productsYeni ürün ekleADMINPUT/products/{id}Ürün güncelleADMINDELETE/products/{id}Ürün silADMIN
Özel Sorgular
MethodURLAçıklamaYetkiGET/products/category/{category}Kategoriye göre filtreleUSER, ADMINGET/products/low-stock/{stock}Stok eşiğin altındakilerUSER, ADMINGET/products/price-range?minPrice=&maxPrice=Fiyat aralığına göre filtreleUSER, ADMINGET/products/search?name=İsme göre araUSER, ADMIN

Kurulum ve Çalıştırma
Gereksinimler

Java 17+
IntelliJ IDEA
Postman (test için)

Adımlar
1. Repoyu klonla:
bashgit clone https://github.com/kullanici-adin/stockmanager.git
cd stockmanager
2. Dosyaları yerleştir:

Yeni bir klasör aç ve içinde src/main/java/org/example/stockmanager yolunu oluştur
controller, dto, entity, exception, repository, security, service klasörlerini oluştur
Her dosyayı ilgili klasörüne koy, StockmanagerApplication.java ana dizinde kalacak
Frontend dosyalarını src/main/resources/static klasörüne koy

3. IntelliJ IDEA'da aç:



4. Çalıştır:

StockmanagerApplication.java dosyasını aç
Yeşil ▶ butonuna bas

5. Test et:

-API: http://localhost:8080/products


-Frontend: http://localhost:8080/index.html


Postman ile Test
POST isteği için Body → raw → JSON:
json{
  "name": "Laptop",
  "category": "Elektronik",
  "stock": 50,
  "price": 15000.00
}
Postman'de Authorization → Basic Auth sekmesinden kullanıcı adı ve şifre gir.

Validation Kuralları
AlanKuralnameBoş olamaz, 2-100 karaktercategoryBoş olamazstock0'dan küçük olamazprice0'dan büyük olmalı