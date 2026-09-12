# Project Guidelines & Architecture Standards

## 1. Tech Stack & Environment
- Language: Java 17+
- Framework: Spring Boot 3.x
- Data Access: Spring Data JPA (Hibernate)
- Database: PostgreSQL (schema: snake_case)
- Security: Spring Security 6.x + JJWT (Stateless JWT Authentication)
- Build Tool: Maven
- Configuration: application.yaml (strictly use spaces for indentation, no tabs)
- Scope: Backend REST API only. Absolutely do NOT generate frontend code (React, HTML/CSS, Thymeleaf) or browser mock previews unless explicitly requested.

---

## 2. Directory Structure Conventions
Keep all source code organized under the primary package: `src/main/java/com/example/projectmanagement/`

```text
├── config/              # App configurations (@Configuration: CORS, Swagger/OpenAPI, Beans)
├── controller/          # REST Controllers exposing HTTP endpoints
├── dto/
│   ├── request/         # Request payloads with Jakarta Validation annotations
│   └── response/        # Response payloads and standard API envelopes
├── entity/              # JPA Entities mapped to PostgreSQL tables
├── exception/           # Custom business exceptions & @RestControllerAdvice handler
├── repository/          # Spring Data JPA Repository interfaces
├── security/            # SecurityFilterChain, JWT filters, UserDetailsService
└── service/             # Business logic interfaces
    └── impl/            # Service implementation classes
3. Architecture & Coding Rules
  Layer Separation & Responsibilities
  Controller: Only handle HTTP routing, request validation triggering, and returning ResponseEntity<ApiResponse<T>>. No business logic allowed here.

  Service: Contain all core business rules, transactional logic (@Transactional), data mapping, and entity lifecycle operations.

  Repository: Pure database access inheriting JpaRepository<Entity, ID>. Write JPQL or native queries only when basic derived queries are insufficient.

  Entity vs DTO Policy:

  NEVER return JPA Entities directly to the client or accept them in Controllers.

  Inbound data must use classes in dto/request/ with Jakarta annotations (@NotNull, @NotBlank, @Email, @Size).

  Outbound data must be converted into classes in dto/response/ to prevent exposing sensitive fields (passwords, salts) and eliminate JPA recursive serialization errors (@OneToMany).
Coding Style & Lombok Usage
  Standard naming: camelCase for fields/methods, PascalCase for classes/interfaces, UPPER_SNAKE_CASE for constants.

  Lombok annotations:

  Use @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor, @Builder where appropriate.

  Use @RequiredArgsConstructor with private final fields for Dependency Injection. Do NOT use @Autowired field injection.

  Avoid @Data on JPA Entities to prevent broken hashCode(), equals(), and recursion in toString().
4. Response & Error Handling Standards
Unified API Response Envelope
All controller endpoints must wrap the payload using a generic wrapper class:

Java
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    private LocalDateTime timestamp;
}
Exception Handling
Throw domain-specific exceptions (e.g., ResourceNotFoundException, BadRequestException, UnauthorizedException).

All exceptions must be intercepted and formatted via a single @RestControllerAdvice class (GlobalExceptionHandler), returning consistent HTTP status codes and error payloads.

5. Security & Authentication Rules
Maintain a stateless session model (SessionCreationPolicy.STATELESS).

Authentication flow: Validate credentials/OTP -> Generate JWT Access & Refresh Tokens.

Protect endpoints with JwtAuthenticationFilter positioned before UsernamePasswordAuthenticationFilter.

Passwords and OTP hashes must always be encrypted using BCryptPasswordEncoder. OTP codes must have an expiration window (TTL).


<ElicitationsGroup message="Bạn có muốn tạo các file code nền móng dựa trên file quy tắc này?">
  <Elicitation label="Tạo class ApiResponse và GlobalExceptionHandler" query="Viết mã nguồn Java cho class ApiResponse<T"> và GlobalExceptionHandler theo đúng file quy tắc trên."/>
  <Elicitation label="Tạo cấu hình SecurityConfig và JWT Filter" query="Viết mã nguồn Java cho SecurityConfig (Spring Boot 3) và JwtAuthenticationFilter theo chuẩn stateless."/>
</ElicitationsGroup>