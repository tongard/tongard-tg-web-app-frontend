# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем сборку Angular приложения в директорию Nginx
COPY dist/frontend-app/browser /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx в режиме отладки
CMD ["nginx", "-g", "daemon off;"]
