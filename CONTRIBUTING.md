# Cómo hacer un commit en este repo

Este proyecto usa [release-please](https://github.com/googleapis/release-please)
para calcular versiones y generar el changelog a partir de los mensajes de
commit, siguiendo el formato de [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).
Un commit mal formado no rompe el build, pero sí el versionado automático:
release-please decide qué versión toca (patch/minor/major) leyendo el `type`
del commit.

## Formato

```
<type>(<scope opcional>)<!>: <descripción en imperativo, minúscula, sin punto final>

<cuerpo opcional: qué cambia y por qué, en bullets si son varios cambios>

<footer opcional: BREAKING CHANGE: ..., Refs: #123>
```

- **Una línea de asunto ≤ 72 caracteres**, en inglés (así está el resto del
  historial), tipo y descripción en minúscula.
- El `scope` es el área que toca el commit (`seo`, `i18n`, `branding`,
  `deps`...). Es opcional pero ayuda a agrupar el changelog.
- Si el commit rompe compatibilidad, añade `!` tras el type/scope
  (`feat(i18n)!:`) **y** un footer `BREAKING CHANGE: <explicación>`.
- El cuerpo debe explicar el *porqué*, no repetir el diff línea a línea.

## Tipos que usa release-please

| type       | cuándo usarlo                                              | efecto en versión |
|------------|-------------------------------------------------------------|--------------------|
| `feat`     | nueva funcionalidad visible para quien usa el proyecto       | minor              |
| `fix`      | corrige un bug o comportamiento incorrecto                   | patch              |
| `perf`     | mejora de rendimiento sin cambiar comportamiento              | patch              |
| `refactor` | cambio interno sin alterar comportamiento externo             | ninguno            |
| `chore`    | tareas de mantenimiento, rebranding, config, dependencias     | ninguno            |
| `docs`     | solo documentación                                            | ninguno            |
| `style`    | formato/lint, sin cambios de lógica                           | ninguno            |
| `test`     | añade o corrige tests                                         | ninguno            |
| `build`    | build system, dependencias de build                           | ninguno            |
| `ci`       | configuración de CI                                            | ninguno            |
| `revert`   | revierte un commit anterior                                    | según el tipo revertido |

Añadir `!` a cualquiera de estos tipos (o un footer `BREAKING CHANGE:`) fuerza
un bump **major**, sin importar el tipo.

No se usan tipos inventados como `add:` — ese caso concreto normalmente es
`feat` (si añade algo que la app expone) o `chore` (si es un archivo de
soporte/metadata que no cambia el comportamiento para quien usa la app).

## Pasos para commitear

```bash
git add <archivos>
git commit -m "type(scope): descripción corta" -m "cuerpo con el porqué, si hace falta"
```

Antes de hacer commit, revisa que el mensaje describa **todo** lo que cambia
el diff (no solo la parte más obvia): si un commit mezcla cosas de tipos
distintos, mejor dividirlo en varios `git add -p` + `git commit` por
separado, o usar el `type` que domine el conjunto y detallar el resto en el
cuerpo.

## Firma de commits

Este repo tiene `commit.gpgsign = true` (firma SSH, `gpg.format = ssh`). Si
`git commit` falla con `Couldn't sign message (signer): agent refused
operation`, el agente SSH (p. ej. 1Password, ssh-agent con una clave que
requiere confirmación) no autorizó la firma: reinténtalo tras aprobar el
prompt/touch de tu agente. No se debe desactivar la firma (`--no-gpg-sign`)
como solución permanente sin decidirlo explícitamente.
