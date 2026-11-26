# Guion de estudio: Cálculo Multivariable (examen + sustentación)

## 0. Para pegar en otro proveedor (tutor)

> Eres mi tutor de Cálculo Multivariable. Sé derivar mecánicamente (bajar exponente) pero no recuerdo la
> regla de la cadena ni sistemas de ecuaciones. Método: me das UN ejercicio a la vez, yo respondo, tú
> dices si está bien y explicas solo el error. No me des la respuesta antes de que lo intente.
> Estoy en la Parte 2 de `guion.md`. Las soluciones están en la Parte 8: úsalas para corregirme.

## 1. Método de 5 pasos (sirve para todo)

1. Escribe la función.
2. Deriva respecto a cada variable (la otra es constante). Regla de la cadena: 2·(interior)·(derivada del interior).
3. Iguala todas las derivadas a 0.
4. Resuelve el sistema: despeja la variable con coeficiente 1 y sustituye en la otra.
5. Hessiano: D = f_xx·f_yy − (f_xy)². D>0 y f_xx>0 → mínimo; D>0 y f_xx<0 → máximo; D<0 → silla.

**Errores que ya cometí (revisar siempre):**
- Se me cae una variable al copiar (`4x + 2y` → `4 + 2y`). Antes de despejar, revisar que cada término tenga sus letras.
- Signos al derivar con regla de la cadena (el −xᵢ y el −1 de adentro).
- Despejar mal. **Siempre meter el punto de vuelta en las derivadas**: si no dan 0, hay error.
- ∇S apunta hacia donde sube; −∇S hacia donde baja.

**Verificación rápida de las derivadas de S:** en S_a y S_b los coeficientes de a y b son 2Σx², 2Σx (dos veces) y 2n.

## 2. Qué cubre y qué NO cubre lo hecho hasta ahora

Hecho: derivadas parciales (3 fáciles), punto crítico y Hessiano (3 medianos), regresión con 3 datos (en curso).
**No cubierto aún** (requisitos.md): geometría 7.5–7.8 (superficie, trazas, secciones, curvas de nivel),
residuos, RMSE y R² (§11–12), análisis adicional A–D (§13), código y pseudocódigo (§8–9). Van abajo.

## 3. Nivel profe 1: regresión completa (retomar aquí)

Datos (0,2), (1,3), (2,7). Ya tengo: S = (2−b)² + (3−a−b)² + (7−2a−b)²,
S_a = 10a + 6b − 34, S_b = 6a + 6b − 24, ecuaciones normales 5a + 3b = 17 y a + b = 4.

c) Resolver para a\* y b\* y comprobar en las dos ecuaciones.
d) Escribir H, calcular det H y clasificar. ¿Cómo se relaciona det H con D₀ = nΣx² − (Σx)²?
e) Calcular los residuos eᵢ = yᵢ − (a\*xᵢ + b\*). ¿Cuánto suman? ¿Por qué?
f) Calcular S_min, RMSE = √(S_min/n) y R² = 1 − S_min/Σ(yᵢ − ȳ)².
g) Resolver lo mismo con la fórmula cerrada a\* = (nΣxy − ΣxΣy)/D₀, b\* = (Σy − a\*Σx)/n, y comparar.

## 4. Nivel profe 2: geometría (con los mismos datos)

a) Valores propios de H. ¿Por qué las curvas de nivel son elipses? ¿Cuál es la razón entre sus ejes (√(λ₂/λ₁))?
b) ¿Por qué salen inclinadas? ¿Qué cambio de variable las endereza? Calcular el nuevo H con x̃ = x − x̄.
c) Traza S(a, b\*) y S(a\*, b): escribirlas como polinomio, hallar su vértice y comprobar que cae en (a\*, b\*).
d) Sección transversal con b₀ = 0: escribir S(a, 0), hallar su vértice y comprobar con
   a_vértice(b₀) = a\* − (Σx/Σx²)(b₀ − b\*).
e) Calcular ∇S en (0,0). ¿Hacia dónde apunta −∇S? ¿Por qué ∇S ⊥ curvas de nivel? (regla de la cadena: ∇S·r′ = 0)
f) ¿Qué significa geométricamente ∇S = 0? ¿Y que H sea constante?

## 5. Nivel profe 3: análisis adicional y casos límite (mismos datos)

a) **Opción A (sensibilidad):** cambiar y₃ de 7 a 7.5. ¿Cuánto cambian a\* y b\*?
b) **Opción B (influencia):** quitar el punto (1,3). ¿Cómo cambia la recta? ¿Y si se quita (2,7)?
c) **Opción C (cuadrático):** ajustar y = αx² + βx + γ por los 3 puntos. ¿Qué S y R² da? ¿Por qué eso NO prueba que sea mejor modelo?
d) **Opción D (tamaño de muestra):** ajustar solo con los 2 primeros puntos y luego con los 3. ¿Qué pasa con a\*?
e) **Caso degenerado:** datos (1,2), (1,4), (1,6). Calcular D₀ y det H. ¿Qué pasa con el sistema y con la forma de la superficie?
f) En el proyecto S_aa/S_bb ≈ 11 700 y λ₂/λ₁ ≈ 38 029. ¿Cuál de los dos habla de "qué tan alargada" es la elipse y por qué hay una raíz?

## 6. Residuos, RMSE y R² (§11–12) y código (§8–9): preguntas orales

1. Residuo vs ángulo: ¿centrados en 0? ¿patrón curvo? ¿la dispersión crece con x? ¿atípicos? ¿Qué sería "desviación sistemática"?
2. ¿Qué mide el RMSE en este experimento y en qué unidad? ¿Qué mide R²?
3. R² crudo = 0.094 y R² de medias = 0.969: ¿por qué no es contradicción?
   (90.3 % de la varianza es DENTRO del mismo ángulo: 1/3 entre personas, 2/3 la misma persona entre ensayos;
   no depende de (a,b). 16 de 17 personas tienen pendiente > 0. Con un tiempo base por persona, a\* igual y R² = 0.38.)
4. Pseudocódigo: cargar CSV → n, Σx, Σy, Σx², Σxy → a\*, b\* → S_min → H, det H → criterio → residuos, RMSE, R² → comparar con polyfit/linregress.
5. ¿Por qué hay que programar el método y solo después usar la librería? (§8 aclaración)
6. Tabla comparativa a, b, S_min: manual / código / librería / diferencia máxima (~1e-14).

## 7. Los números del proyecto (memorizar)

- n = 595, Σx = 53 550, Σy = 553 544.9, Σx² = 6 961 500, Σxy = 55 702 551, D₀ = 1 274 490 000
- **a\* = 2.746737 ms/°, b\* = 683.1213 ms**, ω = 1000/a\* ≈ 364 °/s, S_min = 156 163 296
- H = [[13 923 000, 107 100], [107 100, 1 190]], det H = 5 097 960 000 = 4·D₀
- RMSE = 512.3 ms, R² = 0.0938 | en medias: RMSE = 29.7 ms, R² = 0.9685
- **Atajo de 60 s con 7 medias** (718.68, 751.74, 790.02, 954.60, 1006.84, 1121.30, 1169.12 en x = 0,30,…,180):
  Σx = 630, Σȳ = 6512.30, Σx² = 81 900, Σxȳ = 655 324.13, D₀ = 7·81 900 − 630² = 176 400,
  a\* = (7·655 324.13 − 630·6512.30)/176 400 = 2.7467, b\* = (6512.30 − a\*·630)/7 = 683.12
- Datos: 15 personas con protocolo + 2 sumadas después de ver su ajuste. a\* = 2.65 (15), 2.75 (17), 2.41 (todo, n = 875).

**Práctica extra sin guía** (hacer completa: normales, a\*, b\*, H, residuos, RMSE, R²):
datos (1,3), (2,5), (3,8), (4,9). Respuestas: a\* = 2.1, b\* = 1, S_min = 0.70, H = [[60,20],[20,8]], det H = 80.

## 8. Soluciones

**Fáciles/medianos ya hechos:** F1: f_x = 2xy³−4, f_y = 3x²y²+1, ∇f(2,1) = (0,13). F2: ∇g(1,1) = (−6,−2). F3: ∇h(0,0) = (−20,−12).
M1: mín en (2,−3), f = −8. M2: silla en (1,−2), D = −12. M3: mín en (3,0), D = 3.

**Profe 1** (c) De a + b = 4, b = 4 − a; 5a + 3(4 − a) = 17 → 2a = 5 → **a\* = 2.5, b\* = 1.5**.
(d) H = [[10,6],[6,6]], det = 24 > 0, S_aa = 10 > 0 → mínimo global; 24 = 4·D₀ con D₀ = 3·5 − 9 = 6.
(e) Residuos 0.5, −1, 0.5; suman 0 (porque S_b = 0 es justo Σe = 0).
(f) S_min = 0.25 + 1 + 0.25 = 1.5; RMSE = √(1.5/3) = 0.707; ȳ = 4, SST = 14, R² = 1 − 1.5/14 = 0.893.
(g) Σx = 3, Σy = 12, Σx² = 5, Σxy = 17, n = 3: a\* = (3·17 − 3·12)/6 = 15/6 = 2.5; b\* = (12 − 2.5·3)/3 = 1.5 ✓.

**Profe 2** (a) λ = 8 ± √40 = 14.32 y 1.68, ambos > 0 → elipses; ejes en razón √8.5 ≈ 2.9.
(b) Inclinadas por S_ab = 6 ≠ 0. Con x̃ = x − 1: Σx̃ = 0, Σx̃² = 2 → H = [[4,0],[0,6]], diagonal, elipses derechas.
(c) S(a, 1.5) = 5a² − 25a + 32.75, vértice a = 2.5, valor 1.5. S(2.5, b) = 3b² − 9b + 8.25, vértice b = 1.5, valor 1.5.
(d) S(a,0) = 5a² − 34a + 62, vértice 3.4; fórmula: 2.5 − (3/5)(0 − 1.5) = 3.4 ✓.
(e) ∇S(0,0) = (−34, −24), −∇S = (34, 24) apunta hacia (2.5, 1.5). ⊥ por regla de la cadena.
(f) ∇S = 0 es plano tangente horizontal (no se puede bajar más). H constante → paraboloide convexo → mínimo único y global.

**Profe 3** (a) y₃ = 7.5: Σy = 12.5, Σxy = 18, a\* = (54 − 37.5)/6 = 2.75, b\* = (12.5 − 8.25)/3 = 1.417. Δy = 0.5 mueve a\* en 0.25 (= 0.5·x̃₃/Σx̃² = 0.5·1/2): sensibilidad lineal y pequeña.
(b) Sin (1,3): recta por (0,2) y (2,7): a\* = 2.5, b\* = 2, S = 0 (queda exacta). Sin (2,7): recta por (0,2) y (1,3): a\* = 1, b\* = 2. El punto (2,7) tiene mucha influencia (está lejos del centro x̄ = 1).
(c) y = 1.5x² − 0.5x + 2, S = 0, R² = 1: 3 parámetros y 3 puntos siempre ajustan exacto. No prueba nada: es sobreajuste; en el proyecto el cuadrático solo sube R² de 0.0938 a 0.0941.
(d) 2 puntos: a\* = 1, b\* = 2; 3 puntos: a\* = 2.5. Con pocos datos a\* cambia mucho; en el proyecto se estabiliza desde ~10 personas.
(e) D₀ = 3·3 − 3² = 0, det H = 0: las dos ecuaciones normales son la misma, infinitas soluciones (todas las rectas por (1,4)); S pasa de paraboloide a cilindro parabólico (canaleta). Hacen falta ≥ 2 valores distintos de x.
(f) λ₂/λ₁ describe la forma; los ejes de la elipse son √(λ₂/λ₁) ≈ 195 veces más largos uno que otro (porque S = ½ vᵀHv, los ejes crecen con 1/√λ). S_aa/S_bb ≈ 11 700 es sensibilidad por unidad de a contra b, otra cosa.
