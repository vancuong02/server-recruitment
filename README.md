# Tuyển Dụng - Job Portal

## Tên đề tài

Hệ thống Tuyển dụng và Quản lý Công việc (Job Portal & Management System)

## Mô tả

Một nền tảng tuyển dụng toàn diện được xây dựng bằng NestJS (Backend) và ReactJS (Frontend), cho phép kết nối nhà tuyển dụng và người tìm việc. Hệ thống cung cấp các tính năng quản lý công việc, ứng viên, và quy trình tuyển dụng.

## Ứng dụng thực tế

-   Các công ty tuyển dụng có thể đăng tin và quản lý quy trình tuyển dụng
-   Ứng viên có thể tìm kiếm việc làm và nộp hồ sơ
-   Quản trị viên có thể quản lý toàn bộ hệ thống
-   Tự động hóa quy trình tuyển dụng
-   Phân tích và báo cáo dữ liệu tuyển dụng

## Các chức năng của ứng dụng

### 1. Quản lý người dùng (Users Module)

-   Đăng ký, đăng nhập với JWT authentication
-   Phân quyền người dùng (RBAC)
-   Quản lý thông tin cá nhân
-   Xác thực hai lớp

### 2. Quản lý công ty (Companies Module)

-   Đăng ký thông tin công ty
-   Quản lý profile công ty
-   Theo dõi hoạt động tuyển dụng

### 3. Quản lý công việc (Jobs Module)

-   Đăng tin tuyển dụng
-   Tìm kiếm việc làm
-   Lọc và sắp xếp công việc
-   Theo dõi trạng thái ứng tuyển

### 4. Quản lý hồ sơ (Resumes Module)

-   Upload và quản lý CV
-   Theo dõi lịch sử ứng tuyển
-   Đánh giá ứng viên

### 5. Quản lý quyền (Permissions & Roles Module)

-   Phân quyền chi tiết
-   Quản lý vai trò người dùng
-   Kiểm soát truy cập

### 6. Quản lý file (Files Module)

-   Upload file với AWS S3
-   Quản lý tài liệu
-   Xử lý hình ảnh

### 7. Hệ thống Email (Mail Module)

-   Gửi email thông báo
-   Email template với Handlebars
-   Quản lý subscriber

## Công nghệ sử dụng

### Backend (NestJS)

1. **NestJS Framework**

-   Kiến trúc module
-   Dependency injection
-   Decorators và Pipes

2. **Database & ORM**

-   MongoDB với Mongoose
-   Soft delete plugin
-   Schema validation

3. **Authentication & Authorization**

-   JWT (JSON Web Tokens)
-   Passport.js
-   Session management

4. **API Documentation**

-   Swagger/OpenAPI
-   API versioning
-   Response transformation

5. **Security**

-   Helmet middleware
-   CORS protection
-   Rate limiting (Throttler)

6. **File Storage**

-   AWS S3 integration
-   Multer middleware
-   File streaming

7. **Email Service**

-   Nodemailer
-   Handlebars templates
-   Queue system

8. **Monitoring & Health**

-   Health checks
-   Performance monitoring
-   Error tracking

### Frontend (ReactJS)

1. **UI Framework**

-   Ant Design
-   Pro Components
-   Custom themes

2. **State Management**

-   Redux Toolkit
-   Redux Persist
-   Async state handling

3. **Routing & Navigation**

-   React Router DOM
-   Protected routes
-   Navigation guards

4. **Form Handling**

-   Form validation
-   File upload
-   Rich text editor (TinyMCE)

5. **API Integration**

-   Axios
-   Request/Response interceptors
-   Error handling

6. **Performance Optimization**

-   Code splitting
-   Lazy loading
-   Bundle optimization
