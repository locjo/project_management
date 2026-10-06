# Giai đoạn 1: Build ứng dụng React
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Phục vụ qua Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Nếu bạn dùng React Router, cần cấu hình thêm file nginx.conf để tránh lỗi 404 khi F5 trang
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]