# Build stage
FROM node:23-alpine AS builder

WORKDIR /usr/src/app

# Copy only package files first to leverage Docker cache
COPY package*.json ./

RUN npm i

# Copy the rest of the files
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY data.json ./
COPY public ./public
COPY src ./src

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy only the built files from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]