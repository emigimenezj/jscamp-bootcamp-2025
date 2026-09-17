# Aclaraciones 🙏

No pude completar la tarea 4 porque la versión de `Docker CLI` que tengo instalada no incluye el comando `docker init`.

Investigando un poco, entendí que esta funcionalidad viene incluida con `Docker Desktop`. En mi caso ya tenía de antes ocnfigurado `Docker CLI` y además también tengo algunos entornos y herramientas del trabajo funcionando sobre esta instalación, por lo que opté por preferir no tocar nada con respecto a Docker para probar las instrucciones de la tarea 4.

De todas formas, por lo que entendí del ejercicio, la tarea consiste en ejecutar `docker init` y quedarte con los archivos que Docker genera uatomáticamente (que serían el Dockerfile, .dockerignore, etc.), y no mucho más que eso.

**Respuesta:**
Si! No te preocupes, ya lo agregamos por ti. Al menos así te queda en el repositorio.

# Dudas

- Ahora que aprendí las bases de docker de manera un poco más sólida ¿qué camino recomendarían para seguir profundizando? ¿Tiene sentido continuar con Docker Compose o Kubernetes o estudiar otros conceptos o herramientas que sean mejores hoy en día? También agradecería cualquier recomendación de recurso, ya sea artículo, libro, otro curso especialoizado, algún proyecto práctico o referencia que consideren útil para seguir avanzando con el aprendizaje de esta herramienta. Cualquier puntero me sirve para orientarme un poco. 😁

**Respuesta:**
Hay algunas cosas que si veo interesante avanzar:

Antes que nada `Docker Compose`, es el siguiente paso natural y uno de los más usados (si no es el más usado). Esto obligatorio antes de ir a Kubernetes.

Después podes avanzar en imágenes y registros, aquí podes aprender de multi-arch, publicar en Docker Hub y explorar un poco cómo reducir el tamaño de imágenes.

Si te quieres meter en el mundo de DevOps, después de esto podes avanzar en CI/CD con Docker, construir y publicar imágenes desde GitHub Actions. Esto es genial porque pasas de tener un entorno local a algo más "DevOps".

Y por último si entraría a Kubernetes.

Sobre recursos, no estoy metido en el mundo de DevOps, el único que conozco y se que es una persona increíble y muy buen creador es https://www.youtube.com/watch?v=CV_Uf3Dq-EU&list=PLqRCtm0kbeHAep1hc7yW-EZQoAJqSTgD-&index=17

En ese video habla de docker y al final sobre compose, lo vería como base para ver si va contigo, y si es así, poder avanzar un poco más.

- No quería dejar de consultar ¿qué usos interesantes o poco habituales de los contenedores de Docker conocen? Más allá de los casos típicos de desplegar aplicaciones, servicios o bases de datos me interesaría conocer ejemplos que permitan ampliar un poco la idea de para qué pueden utilizarse los contenedores y descubrir potencialmente casos nuevos de uso que no son tan evidentes en un principio. Creo que esto me podría dar bastante perspectiva ahora que me estoy metiendo más seriamente con Docker.

**Respuesta:**
Cuando veas compose verás más utilidades, esto no es raro y poco habitual pero de lo que más me sirve es tener bases de datos efímeras para tests, puedo levantar un Postgres en un contenedor en CI, correr los tests y destruirlo al terminar. Tener versiones de Postgres en diferentes imágenes según el proyecto también es muy útil, sin tener que instalarlas en mi propia máquina.

Luego hay cosas super raras como tener windows o MacOS instaladas dentro de un contenedor de Docker, o tener un navegador, IDE, etc dentro el cual poder visualizarlo en tu máquina por medio de una ventana.

A nivel de seguridad se que lo usan mucho para correr código no confiable dentro, si se rompe algo o hay algún ataque, se hace dentro del contenedor y no en tu propia máquina.

Son casos poco habituales pero es un poco lo que se me ocurre.

PD: Esta chica a venido a alguna MiduConf de años anteriores, trabaja en Microsoft y sube contenido de contenedores, docker y Kubernetes: https://www.youtube.com/@returngis/videos es muy buena explicando y alguna cosa interesante puedes buscar :)
