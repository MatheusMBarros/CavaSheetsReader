#!/bin/bash
git fetch https://github.com/MatheusMBarros/CavaSheetsReader.git
git pull https://github.com/MatheusMBarros/CavaSheetsReader.git

# Navegar para o diretório "frontend" e executar o comando npm run start em segundo plano
cd ./frontend
npm run start &

# Voltar para o diretório anterior
cd ..

# Navegar para o diretório "backend" e executar o comando node
cd ./backend
node --watch src/index.js
