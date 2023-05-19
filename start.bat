@echo off
start "Consola Backend" cmd /k "cd Backend & php artisan serve"
start "Consola Frontend" cmd /k "cd FrontEnd & php -S localhost:8100"

start "" http://localhost:8100