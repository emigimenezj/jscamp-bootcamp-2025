# Dudas

## Workflow `schedule` no se ejecuta automáticamente

Tengo un workflow con schedule que configuré para ejecutarse cada 10 minutos:

```yaml
on:
  schedule:
    - cron: "*/10 * * * *"
  workflow_dispatch:
```

El workflow está en main (aunque lo dejé con minutos específicos para hacer pruebas) y la ejecución manual con workflow_dispatch funciona correctamente, pero el schedule no se dispara nunca, incluso después de esperar varios minutos donde se debería haber ejecutado varias veces.

**¿Hay alguna consideración adicional o limitación de GitHub Actions con los workflows programados que pueda explicar este comportamiento?**

**Respuesta:**
Hola! Si, depende un poco el estado de GitHub Actions y la recurrencia global, que pasa:
Si ponemos un horario típico con números como "*/10 * * * *" lo más probable es que GitHub tenga en ese tiempo muchas actions que correr a nivel global, y puede atrasar tu proceso. Vi que luego lo cambiaste y ya funciona mejor.

Por otro lado, lo que tengo entendido es que las actions de menos de 5 minutos de recurrencia (que se ejecutan cada 5 min) directamente las desestima, lo que hiciste fue ponerlo de más tiempo, pero puede ser que hayan cambiado ese número.

Esas son las dos cosas que se me ocurren que pudo haber pasado.

## ¿Qué sigue después de aprender las bases?

Hasta ahora tuve poco contacto práctico con CI/CD, y este ejercicio me sirvió para entender las bases.

De cara a seguir avanzando, ¿qué conceptos, herramientas, recursos o proyectos prácticos dirían que está bueno estudiar a continuación para acercarme a un uso más real de CI/CD en proyectos reales?

**Respuesta:**

Con proyectos medianos, ya con el hecho de hacer workflows en paralelo es mucho mejor de lo que actualmente hacen algunas organizaciones.

Podemos seguir mejorando esto? Si:
Hay algo que se llama `Reusable workflows` que se hace con la llamada `workflow_call` y que permite que los workflows sean reutilizables entre repositorios. Lo veo muy bueno para empresas grandes que tienen diferentes productos: creo un repo con todos los workflows base que necesito según mi lógica de negocio, y luego simplemente las llamo desde cada repositorio separado. Si se monta bien, es un +plus importante que puede marcar la diferencia.

Algo que no se hace mucho: usar `concurrency`, esto evita runs duplicadas cuando se hacen dos push en el repositorio al mismo tiempo. Cancelamos el anterior y priorizamos el último. En empresas grandes puede pasar que se hagan despliegues cada poco tiempo y esto, evita errores y tiempo consumido en GitHub Actions.

Otro punto que puedes indagar, es la seguridad en los workflows, puede darle otro +plus importante.

Y como consejo:
Ver repositorios de librerías que te gusten (seguramente tengan GitHub Actions) y revisar cómo están configurados. El mejor aprendizaje es probando y viendo como lo hacen los demás.