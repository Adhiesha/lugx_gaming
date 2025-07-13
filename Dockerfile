# Use Nginx base image
FROM nginx:alpine

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy all HTML and asset files to nginx's web root
COPY . /usr/share/nginx/html