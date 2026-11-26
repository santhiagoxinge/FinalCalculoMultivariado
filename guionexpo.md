# Guion de la exposición: NeuroCode

Presentación: **`presentacion/neurocode.html`** (24 diapositivas; `slides.pdf` es una versión vieja de 18).
Tiempo objetivo: 15 a 18 minutos. Hablar con tus palabras; las frases en «comillas» son para decir casi textual.

---

## 1. El proyecto en 1 minuto (si solo lees esto, lee esto)

1. **El fenómeno.** Si te muestran una letra R girada y te preguntan "¿está normal o en espejo?", tu cerebro
   la **gira en la mente** hasta ponerla derecha. Mientras más girada, más tarda.
2. **El experimento.** Hicimos una app: 17 personas, 7 ángulos (0°, 30°, …, 180°), 5 veces cada uno = **595 respuestas**.
   Guardamos el tiempo de cada acierto.
3. **La pregunta.** El tiempo sube con el ángulo casi en línea recta. ¿**Cuál** es la mejor recta y = a·x + b?
4. **El truco de Cálculo Multivariable.** Cada recta se define con dos números (a, b), o sea es **un punto en un plano**.
   A cada punto le medimos el error S(a, b). Eso es una **superficie con forma de valle**.
   La mejor recta = **el fondo del valle**.
5. **Cómo encontramos el fondo.** Derivadas parciales iguales a cero (∇S = 0) → sistema 2×2 → a\* y b\*.
   Y el **Hessiano** confirma que es un mínimo (y que es el único).
6. **El resultado.** **t = 683 + 2.75·θ ms.** Cada grado cuesta 2.75 ms (≈ 364 grados por segundo).
   683 ms es lo que tardas en ver, decidir y presionar sin girar nada.
7. **La conclusión bonita.** Un computador gira una imagen de un golpe con una matriz (tarda igual para 10° que para 180°).
   **El cerebro gira paso a paso**, por eso tarda más con más ángulo.

---

## 2. Glosario con analogía (para entender, no para recitar)

| Término | Qué es | Analogía |
|---|---|---|
| **x** | ángulo de la R (°) | la "pregunta" |
| **y** | tiempo de respuesta (ms) | lo que medimos |
| **a\*** | pendiente: ms extra por cada grado | "precio por grado" |
| **b\*** | intercepto: tiempo a 0° | "tarifa base" |
| **S(a, b)** | suma de errores al cuadrado de una recta | la **altura** del terreno: mientras más bajo, mejor recta |
| **∂S/∂a, ∂S/∂b** | cuánto sube S si muevo solo a, o solo b | la inclinación del terreno mirando al norte o al este |
| **∇S (gradiente)** | el vector (∂S/∂a, ∂S/∂b) | flecha que apunta **cuesta arriba**; −∇S apunta cuesta abajo |
| **∇S = 0** | punto crítico | piso plano: no hay para dónde bajar |
| **Hessiano H** | matriz de segundas derivadas | dice si el piso plano es **fondo** de valle, **cima** o **silla de montar** |
| **Curvas de nivel** | puntos con el mismo S | como las líneas de un mapa topográfico; aquí son elipses |
| **Residuo** | dato real − lo que predice la recta | cuánto "falló" la recta en ese punto |
| **RMSE** | error típico en ms | "en promedio la recta se equivoca por ~X ms" |
| **R²** | qué fracción de la variación explica la recta | 1 = explica todo; 0 = no explica nada |

---

## 3. Reparto

| Quién | Diapos | Bloque |
|---|---|---|
| Integrante 1 | 1 a 5 | Problema, datos, idea (a, b) = recta, función de error |
| Integrante 2 | 6 a 8 | Gradiente, resultado a\* y b\*, Hessiano |
| Integrante 3 | 9 a 14 | Geometría 3D, código, validación, residuos |
| Integrante 4 | 15 a 24 | R², robustez, transparencia, conclusión, demo, cierre |

**Transiciones** (la última frase de cada uno le pasa la palabra al siguiente):
- 1 → 2: «Ya tenemos una función de dos variables. Ahora [nombre] nos muestra cómo encontrar su mínimo.»
- 2 → 3: «Sabemos que es un mínimo global. [nombre] nos muestra cómo se ve y cómo lo programamos.»
- 3 → 4: «La recta está bien calculada. Ahora [nombre] responde: ¿qué tan buena es y se puede confiar?»

---

## 4. Diapositiva por diapositiva

Formato: **qué se ve** → **qué decir** → *(si te traban)*.

### Integrante 1 — El problema (diapos 1 a 5)

**1. Portada.**
«Medimos cuánto tarda el cerebro en girar una letra, y con Cálculo Multivariable buscamos la recta que mejor lo describe.
Todos los datos son reales, los recolectamos nosotros.»

**2. ¿La R está normal o en espejo?**
Se ve la R girada y los números 17 / 7 / 595.
«Es el experimento clásico de Shepard y Metzler, 1971. La persona ve una R girada y dice si está normal o en espejo.
Para responder, la gira mentalmente. 17 personas × 7 ángulos × 5 repeticiones = 595 ensayos.
x es el ángulo, y es el tiempo en milisegundos. Solo guardamos aciertos.»
*(Por qué solo aciertos: si se equivocó, no sabemos si giró la letra o adivinó.)*

**3. El tiempo sube con el ángulo.**
Dos gráficas: los 595 puntos (nube dispersa) y las 7 medias (casi en línea).
«A 0° tardan en promedio 718.7 ms; a 180°, 1169.1 ms. Los puntos individuales están muy dispersos, pero los promedios
por ángulo suben casi en línea recta. Entonces la pregunta es: ¿cuál es **la mejor** recta?»

**4. Un punto (a, b) es una recta.** ← **la idea más importante de toda la expo**
Laboratorio interactivo: arrastras un punto a la izquierda y la recta cambia a la derecha.
«Esta es la idea central. Toda recta y = ax + b se define con dos números. Entonces cada recta es **un punto** del plano (a, b).
Arrastro el punto: lejos del centro, la recta se despega de los datos y el error S sube.
Cerca del fondo, la recta se pega. Buscar la mejor recta es buscar el punto más bajo.»
*(Demostrarlo en vivo: arrastrar lejos, mostrar que S sube; luego "Ir al óptimo".)*

**5. Medimos el error de cada recta.**
Fórmula S(a, b) = Σ (yᵢ − a·xᵢ − b)².
«Para cada dato, restamos lo real menos lo que predice la recta: eso es el error. Lo elevamos al cuadrado por tres razones:
uno, para que errores positivos y negativos no se cancelen; dos, para castigar más los errores grandes;
tres, porque así S es derivable y podemos buscar el mínimo con derivadas. S es una función de **dos variables**, a y b.»

### Integrante 2 — El cálculo (diapos 6 a 8)

**6. En el fondo del valle, ∇S = 0.**
«En el fondo de un valle el suelo es plano: el plano tangente es horizontal. Eso significa que las dos derivadas parciales son cero.
Derivamos con regla de la cadena, tratando la otra variable como constante:
∂S/∂a = −2 Σ xᵢ (yᵢ − a·xᵢ − b) y ∂S/∂b = −2 Σ (yᵢ − a·xᵢ − b).
Igualando a cero salen dos ecuaciones con dos incógnitas, las **ecuaciones normales**:
a·Σx² + b·Σx = Σxy  y  a·Σx + b·n = Σy.»
*(Regla de la cadena en una línea: derivada de (algo)² = 2·(algo)·(derivada del algo). La derivada de (y − ax − b) respecto a a es −x; respecto a b es −1.)*

**7. Cada grado cuesta 2.75 ms.**
«Metemos las sumatorias reales: n = 595, Σx = 53 550, Σx² = 6 961 500, Σy = 553 544.9, Σxy = 55 702 551.
Resolvemos el sistema y sale **a\* = 2.7467 ms por grado** y **b\* = 683.12 ms**.
¿Qué significan? a\* es el costo de girar: cada grado extra son 2.75 ms. Al revés, 1000 / 2.75 ≈ **364 grados por segundo**:
esa es la velocidad de rotación mental. b\* es el tiempo base: ver la letra, decidir y presionar, sin girar nada.»

**8. El Hessiano dice: mínimo global.**
«∇S = 0 solo dice que el piso es plano; podría ser fondo, cima o silla. Lo decide el Hessiano, la matriz de segundas derivadas:
H = [[2Σx², 2Σx], [2Σx, 2n]] = [[13 923 000, 107 100], [107 100, 1 190]].
Su determinante es 5.098 × 10⁹, positivo, y S_aa también es positivo: es un **mínimo**.
Y algo más fuerte: H **no depende de a ni de b**, es constante. Eso significa que la superficie es un paraboloide convexo,
un tazón: tiene un solo fondo, entonces el mínimo es **único y global**.»
*(Criterio: D > 0 y S_aa > 0 → mínimo; D > 0 y S_aa < 0 → máximo; D < 0 → silla.)*

### Integrante 3 — Geometría y código (diapos 9 a 14)

**9. Un valle con un solo fondo.**
Render 3D de Blender, video del descenso, curvas de nivel.
«Así se ve S(a, b): un paraboloide, un tazón. En el fondo el plano tangente es horizontal.
La bolita baja siguiendo −∇S, que siempre es perpendicular a las curvas de nivel y apunta al fondo.
Las curvas de nivel, los puntos con el mismo error, son **elipses**.»

**10. ¿Por qué las elipses se inclinan?**
«Porque la derivada cruzada S_ab = 2Σx = 107 100 no es cero. Eso quiere decir que a y b están **acoplados**:
si subo la pendiente tengo que bajar el intercepto para que la recta siga pasando por el centro de los datos.
Si centramos x, o sea usamos x − 90°, la suma de x da cero, S_ab = 0 y las elipses se **enderezan**. La pendiente no cambia.»
*(Además son muy alargadas: los valores propios de H están en razón ≈ 38 000, así que un eje es ≈ 195 veces más largo que el otro, que es √38 000.)*

**11. Cada corte por el óptimo es una parábola.**
«Si fijo b en b\* y solo muevo a, el corte de la superficie es una parábola con vértice justo en a\*. Igual fijando a.
Si fijo otro valor, salen parábolas paralelas más arriba. Es la prueba visual de que el fondo es único.»
*(Traza = corte por el óptimo; sección transversal = corte con otro valor fijo.)*

**12. El código replica el cálculo a mano.**
Diagrama de flujo de `codigo/ajuste.py`.
«Programamos el método nosotros, sin librerías de regresión. Cada caja es un paso de lo que hicimos a mano:
cargar los 17 CSV → sumatorias → resolver el sistema 2×2 → S mínimo → Hessiano y criterio → residuos, RMSE y R² →
y al final comparamos con las librerías.»

**13. Tres vías, el mismo punto.**
Tabla: manual / código propio / librerías (polyfit, linregress).
«Las tres coinciden. La diferencia es del orden de 10⁻¹⁴: eso es solo redondeo del computador, no un error.
Queda verificado el cálculo analítico.»

**14. Residuos centrados en 0.**
«El residuo es lo real menos lo predicho. Están centrados en cero, no hay forma de curva (o sea, una recta basta),
y hay un abanico: a ángulos grandes hay más dispersión, eso se llama heterocedasticidad. El atípico más grande es
P09 a 150°: +5015.7 ms, una distracción.»
*(Por qué la media da 0: es justo la ecuación ∂S/∂b = 0, que dice Σ residuos = 0.)*

### Integrante 4 — ¿Qué tan bueno es y qué concluimos? (diapos 15 a 24)

**15. Dos R², una recta.** ← **la pregunta que más seguro hacen**
«Con los 595 ensayos R² = 0.094. Con las 7 medias, **la misma recta** da R² = 0.9685. No es contradicción.
El 90 % de la variación pasa **dentro del mismo ángulo**: hay personas más rápidas y más lentas,
y la misma persona varía de un intento a otro. Ninguna recta que solo conozca el ángulo puede predecir eso.
Cuando promediamos, ese ruido se cancela y aparece la tendencia, y ahí la recta explica el 97 %.»
*(Analogía: la estatura sube con la edad en niños, pero dos niños de 8 años pueden medir muy distinto. La edad no predice a cada niño, pero sí el promedio.)*

**16. 16 de 17 personas.**
«Para probar que el efecto es real, ajustamos una recta a cada persona por separado. 16 de 17 tienen pendiente positiva;
solo P01 no muestra efecto. La prueba de signos da p = 0.00027: no es casualidad.
P09 es la más alta, 8.95; si la quitamos, a\* baja a 2.36 y la conclusión no cambia.»

**17. El error se parte en dos piezas.**
«S mínimo = 155 637 440 (ruido dentro de cada ángulo) + 85 × el error de la recta sobre las medias.
La primera pieza es el 99.7 % y **no depende de a ni de b**: ninguna recta la puede bajar.
Por eso minimizar sobre los 595 ensayos da exactamente la misma recta que sobre las 7 medias.
Y si a cada persona le damos su propio tiempo base (18 variables, mismo método ∇S = 0), la pendiente sale igual y R² sube a 0.38.»

**18. ¿Se rompe la conclusión? No.** (cuatro pruebas)
- «**A, sensibilidad:** metimos ruido de 25 ms 500 veces: a\* se mueve solo 0.6 %.
- **B, atípicos:** sin el más extremo, a\* = 2.61; sin todos los mayores a 3 s, 2.41.
- **C, cuadrático:** una curva mejora R² en 0.0003, nada. Gana la recta por ser más simple.
- **D, tamaño:** desde unas 10 personas, a\* ya se estabiliza.»

**19. Las rectas casi se superponen.**
«Izquierda: todas las variantes de B y C dan rectas casi encima una de otra. Derecha: a\* converge cerca de 2.7 al ir sumando personas.»

**20. Transparencia: con cualquier muestra, a\* > 0.** ← **decirlo de frente, sin pena**
«Los 15 primeros se tomaron con el protocolo. Después llegaron más archivos: quitamos copias y sumamos 2 personas,
y esas 2 se sumaron después de ver su ajuste. Por eso reportamos las tres versiones:
con 15 → a\* = 2.65; con 17 → 2.75; con todo lo recolectado (875 ensayos) → 2.41. La conclusión es la misma.»

**21. El cerebro gira paso a paso.**
«Cerebro: t = 683 + 2.75·θ, el costo crece con el ángulo. Computador: multiplica por la matriz de rotación
R(θ) = [[cos θ, −sen θ], [sen θ, cos θ]] y tarda lo mismo para 10° que para 180°.
Mismo problema, dos estrategias: el cerebro es analógico, gira poco a poco.»

**22. Demo: ahora, pruébelo usted.**
Abrir `figuras/superficie_interactiva.html` (funciona sin internet).
1. Arrastrar el punto en el mapa: la recta y los números cambian.
2. Mostrar la flecha −∇S: siempre apunta al fondo.
3. «Animar descenso»: con gradiente puro casi no avanza (zigzag); escalado converge en ~250 pasos; centrando x, en 39.
«El gradiente puro zigzaguea porque el valle es 38 000 veces más empinado en una dirección que en otra.
Si centramos x, las elipses se enderezan y baja directo.»
*(**Probar la demo antes en el PC de la sala.** Si falla, mostrar el video del descenso de la diapo 9.)*

**23. Lo que nos llevamos.**
«Cuatro ideas: uno, la recta y = 2.75x + 683, cada grado cuesta 2.75 ms. Dos, ∇S = 0 y Hessiano positivo dan un mínimo único y global.
Tres, el doble R²: la misma recta, el ruido está dentro de cada ángulo. Cuatro, límites: 17 personas universitarias,
16 con efecto; el modelo describe la tendencia, no a cada persona.»

**24. Gracias, ¿preguntas?**
«Cualquiera de los cuatro puede deducir las derivadas parciales y el Hessiano en el tablero.»

---

## 5. Preguntas probables (respuesta corta + por qué)

**Del cálculo**

1. **¿Por qué elevar al cuadrado y no usar valor absoluto?**
   El cuadrado no deja que + y − se cancelen, castiga más los errores grandes y es derivable en todas partes. El valor absoluto tiene una esquina en 0 y no se deriva ahí.

2. **¿Cómo saben que es mínimo y no máximo?**
   det H = 5.098 × 10⁹ > 0 y S_aa > 0 → mínimo. Y como H es constante (no tiene a ni b), la superficie es un tazón: el mínimo es único y global.

3. **Deduzca ∂S/∂a en el tablero.**
   S = Σ (y − ax − b)². Derivada de (algo)² = 2·(algo)·(derivada de algo). Derivada de (y − ax − b) respecto a a = −x.
   → ∂S/∂a = −2 Σ x (y − ax − b). Igual con b, la derivada interna es −1 → ∂S/∂b = −2 Σ (y − ax − b).

4. **¿De dónde sale el Hessiano?**
   Derivando otra vez: S_aa = 2Σx², S_bb = 2n, S_ab = 2Σx. Por eso H = [[2Σx², 2Σx], [2Σx, 2n]] y no depende de (a, b).

5. **¿Por qué el gradiente es perpendicular a las curvas de nivel?**
   Sobre una curva de nivel S(a(t), b(t)) = constante. Derivando con regla de la cadena: ∇S · r′(t) = 0. Producto punto cero = perpendiculares.

6. **¿Por qué las elipses están inclinadas? ¿Cómo las enderezan?**
   Porque S_ab = 2Σx ≠ 0 (a y b acoplados). Centrando x̃ = x − 90°, Σx̃ = 0, S_ab = 0 y H queda diagonal.

7. **¿Qué pasa si todos los datos tuvieran el mismo ángulo?**
   det H = 0, las dos ecuaciones normales son la misma, hay infinitas soluciones. La superficie deja de ser tazón y se vuelve una **canaleta** (cilindro parabólico). Se necesitan al menos 2 ángulos distintos.

8. **¿Qué es la traza y qué es la sección transversal?**
   Traza: cortar por el óptimo (b = b\*), la parábola tiene vértice en a\*. Sección: cortar con otro valor fijo, parábola más alta con vértice corrido.

9. **¿Por qué el descenso con gradiente puro zigzaguea?**
   Porque el valle es muy alargado (razón de valores propios ≈ 38 000). El paso tiene que ser chico para no salirse en la dirección empinada, y en la dirección plana avanza casi nada.

10. **¿Qué es 364 °/s?**
    1000 / a\* = 1000 / 2.75: cuántos grados gira la mente en un segundo.

**De los datos y el modelo**

11. **R² = 0.094 es muy bajo, ¿el modelo es malo?**
    No. El 90 % de la variación es dentro del mismo ángulo (personas distintas y el mismo intento a intento) y ninguna función del ángulo lo puede explicar. Con las medias, la misma recta da R² = 0.9685, y 16 de 17 personas tienen pendiente positiva.

12. **¿Por qué no un modelo cuadrático?**
    Lo probamos: mejora R² en 0.0003. No aporta, y entre dos modelos iguales gana el más simple.

13. **¿Cómo escogieron los datos? ¿Por qué 17?**
    15 con el protocolo; 2 se sumaron después de ver su ajuste, y lo decimos. Por eso reportamos 15 (2.65), 17 (2.75) y todo (2.41). La conclusión no cambia.
    ⚠️ **No decir** «los validamos estadísticamente»: elegir datos mirando el resultado no es validar.

14. **¿Por qué solo aciertos?**
    En un error no sabemos si la persona giró la letra o adivinó; el tiempo no mediría la rotación.

15. **¿Qué es el atípico de 5 segundos?**
    P09 a 150°, +5015.7 ms: una distracción. Quitándolo, a\* = 2.61; la conclusión es igual.

16. **¿Para qué programarlo si existe polyfit?**
    Para comprobar que el método a mano funciona. La librería solo la usamos al final para validar: coinciden hasta 10⁻¹⁴.

17. **¿Cuáles son las limitaciones?**
    Muestra pequeña de universitarios (17), mucha diferencia entre personas (pendientes de −0.08 a 8.95), distracciones, y 2 personas agregadas a posteriori.

**Si no sabes una respuesta:** «Buena pregunta; lo que sí sabemos es [lo más cercano que sepas]». Y pasarle la palabra al compañero de ese bloque.

---

## 6. Los números para memorizar (solo estos)

| | |
|---|---|
| Datos | 17 personas × 7 ángulos × 5 = **595** |
| Medias | 718.7 ms (0°) → 1169.1 ms (180°) |
| Recta | **a\* = 2.75 ms/°**, **b\* = 683 ms**, ≈ **364 °/s** |
| Hessiano | [[13 923 000, 107 100], [107 100, 1 190]], det ≈ 5.1 × 10⁹ > 0 |
| R² | **0.094** (595 ensayos) vs **0.9685** (7 medias), misma recta |
| Ruido dentro del ángulo | 90 % de la variación total (99.7 % de S mín) |
| Efecto real | **16 de 17** personas con pendiente positiva |
| Muestras | 15 → 2.65 · 17 → 2.75 · todo → 2.41 |
| Validación | manual = código = librería (diferencia ~10⁻¹⁴) |

*(Si preguntan por qué "90 %" en una diapo y "99.7 %" en otra: el 90 % es sobre la variación total de los tiempos; el 99.7 % es sobre el error que queda después de ajustar la recta. Las dos dicen lo mismo: casi todo el ruido está dentro de cada ángulo.)*

---

## 7. Checklist antes de entrar (5 minutos)

- [ ] Abrir `presentacion/neurocode.html` en el PC de la sala, pantalla completa, y pasar las 24 diapos.
- [ ] Abrir `figuras/superficie_interactiva.html` y pulsar «Animar descenso» una vez.
- [ ] Cada integrante escribe en una hoja: S, las dos parciales, H y el criterio D > 0, S_aa > 0.
- [ ] Decidir quién responde qué: cálculo → integrante 2, geometría/código → 3, R² y datos → 4.

Más a fondo: `informe/hoja_batalla_sustentacion.md` (7 preguntas trampa) y `guion.md` (ejercicios con solución).
