
<p align="center"><h1 align="center">Hiring Group</h1></p>
<p align="center">

</p>
<p align="center">
<img src="https://img.shields.io/github/license/V-enekoder/HiringGroup?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
<img src="https://img.shields.io/github/last-commit/V-enekoder/HiringGroup?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/V-enekoder/HiringGroup?style=default&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/V-enekoder/HiringGroup?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

## 🚀 Tecnologías

*Backend* 

* Go
* Gin
* GORM
* PostgreSQL

*Frontend*

* React Vite
* Ant Desing



### 🛠️ Makefile

El Makefile incluye comandos útiles para gestionar el proyecto. Por favor asegúrate de tener `make` disponible en tu PATH. Entre estos están:

* `env`: Crea un archivo .env con las variable de entorno listas para configurarse
* `seed`: Realiza un llenado de datos inicial

Modo de Uso
```sh
❯ make comando
```
---

### ⚙️ Instalación BACKEND


1. Clonar el repositorio:
```sh
❯ git clone https://github.com/V-enekoder/HiringGroup.git
```

2. Navegar al directorio del proyecto:
```sh
❯ cd HiringGroup
❯ cd backend
```

3. Instalar las dependencias del proyecto:
```sh
  ❯ go mod tidy
```
4. Copiar .env y luego configurar variables de entorno:
```sh
  ❯ make env
```
6. Realizar seeding inicial:
```sh
  ❯ make seed
```


### 🤖 Uso &nbsp; [<img align="center" src="https://img.shields.io/badge/Go-00ADD8.svg?style={badge_style}&logo=go&logoColor=white" />](https://golang.org/)

Para ejecutar el programa se puede utilizar 

```sh
❯ go run main.go
```
o
```sh
❯ make run
```

### ⚙️ Instalación FRONTEND

1. Navegar al directorio del proyecto:
```sh
❯ cd HiringGroup
❯ cd frontend
```

2. Instalar las dependencias del proyecto:
```sh
  ❯ npm i
```



### 🤖 Uso   [<img align="center" src="https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=react&logoColor=white" />](https://react.dev/)

Para ejecutar el programa se puede utilizar 

```sh
  ❯ npm run dev
```