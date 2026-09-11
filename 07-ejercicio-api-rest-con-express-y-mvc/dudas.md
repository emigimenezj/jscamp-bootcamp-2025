# Dudas

## Métodos estáticos en MVC

- En la versión con clases del patrón MVC, tanto el modelo como el controlador terminan usando casi exclusivamente métodos estáticos. ¿Qué ventaja aporta usar una clase en ese caso frente a exportar directamente un objeto con funciones, por ejemplo `{ get, set, clear }`? ¿Hay alguna diferencia conceptual o práctica importante? Por mi parte, si no se van a usar instancias de las clases y todo va a ser estático entonces la notación de clase es boilerplate innecesario, o al menos lo veo así en principio.

## Mapeo explícito vs. spread en actualizaciones

- En el `JobModel`, para `PUT` mapeé explícitamente cada propiedad recibida, mientras que para `PATCH` reutilizo el objeto existente y aplico `...input` sobre él. ¿Es una buena práctica mantener esta diferencia? ¿Conviene evitar el spread de `input` en actualizaciones completas para controlar explícitamente qué propiedades pueden formar parte del recurso? Al menos mi experiencia en programación me enseñó por las buenas y por las malas que no controlar explícitamente lo que hacés puede conducir a desastre.

## Qué tan estricta debería ser una API

- ¿Qué tan estricto debería ser un endpoint con datos que no espera o no utiliza? Por ejemplo, ¿conviene rechazar un `body` enviado en un `DELETE` o query params desconocidos en un `GET`, o normalmente se ignoran?

  Me genera dudas permitirlos porque un parámetro que hoy no significa nada podría adquirir significado en una versión futura de la API y cambiar silenciosamente el comportamiento de una request que antes era válida. ¿Esto es una preocupación razonable en el diseño de APIs?

## Middlewares

- Tomé la decisión de agregar middlewares propios para logging, manejo global de errores y validación de requests, aunque eso se sale un poco del alcance del ejercicio. ¿Es una buena separación de responsabilidades o estoy agregando complejidad innecesaria para este tipo de API?

- Además de estos casos, ¿cuáles dirían que son los usos más comunes y útiles de los middlewares en aplicaciones reales? Me interesan especialmente aquellos que suelen aportar bastante valor pero que a veces no se consideran al principio por desconocimiento.
