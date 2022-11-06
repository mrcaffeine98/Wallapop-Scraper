# Wallapop-Scraper
Scraper para wallapop

Guarda en un JSON los items encontrados, pero no lo devuelve en el result
## Objectivo
Definir un objeto para scraper
Cuando encuentra coincidencias

1. Lo guarda en una base de mongoDB
2. Envia un mensaje por telegram con el nuevo articulo encontrado

## Instalaciones
```bash
npm install axios
```

## Recursos
https://www.youtube.com/watch?v=aZ7j9V3FQK4&ab_channel=Argonautadigital
Con este tutorial tambien se puede hacer webScraping

Se ha intentado utilzar el API Rest de wallapop utilizando el siguiente proyecto 
https://github.com/vromanos/wallanode/blob/master/indexWalla.js
La conclusion es que no se puede utilizar el API rest de wallapop porque Wallapop devuelve forbidden al intentar realizar una peticion http, con la libreria http

https://github.com/machuwey/wallapop-scrapper/blob/master/app.js
Con este repositorio utilizando axios se consigue acceder a la api de wallapop

## Ideas
Para generar una busqueda de forma facil. Se deberia de entrar en wallapop buscar el producto y aplicarle todos los filtros.
Luego pasarle esta url al bot y que genere la busqueda apartir de los parametros proporcionados
