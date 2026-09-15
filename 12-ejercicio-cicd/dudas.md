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

## ¿Qué sigue después de aprender las bases?

Hasta ahora tuve poco contacto práctico con CI/CD, y este ejercicio me sirvió para entender las bases.

De cara a seguir avanzando, ¿qué conceptos, herramientas, recursos o proyectos prácticos dirían que está bueno estudiar a continuación para acercarme a un uso más real de CI/CD en proyectos reales?
