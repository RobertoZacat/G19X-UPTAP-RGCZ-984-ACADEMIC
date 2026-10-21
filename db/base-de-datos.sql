--
-- PostgreSQL database dump
--

\restrict gyJ3OhV8CM2z3AHRGU9zVljzbFhQ4e44umJyEpSByc0OEn6gPCG2MMXcSMR5qcT

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: candidatos; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.candidatos (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    email character varying NOT NULL
);


ALTER TABLE public.candidatos OWNER TO eval_user;

--
-- Name: candidatos_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.candidatos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.candidatos_id_seq OWNER TO eval_user;

--
-- Name: candidatos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.candidatos_id_seq OWNED BY public.candidatos.id;


--
-- Name: examen_preguntas; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.examen_preguntas (
    examen_id integer NOT NULL,
    pregunta_id integer NOT NULL,
    orden integer
);


ALTER TABLE public.examen_preguntas OWNER TO eval_user;

--
-- Name: examenes; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.examenes (
    id integer NOT NULL,
    perfil_id integer,
    titulo character varying NOT NULL,
    tiempo_limite_min integer
);


ALTER TABLE public.examenes OWNER TO eval_user;

--
-- Name: examenes_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.examenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examenes_id_seq OWNER TO eval_user;

--
-- Name: examenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.examenes_id_seq OWNED BY public.examenes.id;


--
-- Name: intentos; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.intentos (
    id integer NOT NULL,
    candidato_id integer,
    examen_id integer,
    iniciado_en timestamp without time zone,
    finalizado_en timestamp without time zone,
    estado character varying
);


ALTER TABLE public.intentos OWNER TO eval_user;

--
-- Name: intentos_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.intentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intentos_id_seq OWNER TO eval_user;

--
-- Name: intentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.intentos_id_seq OWNED BY public.intentos.id;


--
-- Name: perfiles; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.perfiles (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    descripcion text
);


ALTER TABLE public.perfiles OWNER TO eval_user;

--
-- Name: perfiles_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.perfiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfiles_id_seq OWNER TO eval_user;

--
-- Name: perfiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.perfiles_id_seq OWNED BY public.perfiles.id;


--
-- Name: preguntas; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.preguntas (
    id integer NOT NULL,
    perfil_id integer,
    tipo character varying NOT NULL,
    enunciado text NOT NULL,
    rubrica text,
    opciones json,
    respuesta_correcta text
);


ALTER TABLE public.preguntas OWNER TO eval_user;

--
-- Name: preguntas_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.preguntas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.preguntas_id_seq OWNER TO eval_user;

--
-- Name: preguntas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.preguntas_id_seq OWNED BY public.preguntas.id;


--
-- Name: respuestas; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.respuestas (
    id integer NOT NULL,
    intento_id integer,
    pregunta_id integer,
    respuesta_texto text
);


ALTER TABLE public.respuestas OWNER TO eval_user;

--
-- Name: respuestas_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.respuestas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.respuestas_id_seq OWNER TO eval_user;

--
-- Name: respuestas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.respuestas_id_seq OWNED BY public.respuestas.id;


--
-- Name: resultados; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.resultados (
    id integer NOT NULL,
    intento_id integer,
    calificacion_total double precision,
    retroalimentacion_ia text
);


ALTER TABLE public.resultados OWNER TO eval_user;

--
-- Name: resultados_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.resultados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultados_id_seq OWNER TO eval_user;

--
-- Name: resultados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.resultados_id_seq OWNED BY public.resultados.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: eval_user
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    rol character varying
);


ALTER TABLE public.usuarios OWNER TO eval_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: eval_user
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO eval_user;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eval_user
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: candidatos id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.candidatos ALTER COLUMN id SET DEFAULT nextval('public.candidatos_id_seq'::regclass);


--
-- Name: examenes id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.examenes ALTER COLUMN id SET DEFAULT nextval('public.examenes_id_seq'::regclass);


--
-- Name: intentos id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.intentos ALTER COLUMN id SET DEFAULT nextval('public.intentos_id_seq'::regclass);


--
-- Name: perfiles id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.perfiles ALTER COLUMN id SET DEFAULT nextval('public.perfiles_id_seq'::regclass);


--
-- Name: preguntas id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.preguntas ALTER COLUMN id SET DEFAULT nextval('public.preguntas_id_seq'::regclass);


--
-- Name: respuestas id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.respuestas ALTER COLUMN id SET DEFAULT nextval('public.respuestas_id_seq'::regclass);


--
-- Name: resultados id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.resultados ALTER COLUMN id SET DEFAULT nextval('public.resultados_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: candidatos; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.candidatos (id, nombre, email) FROM stdin;
1	Juan Pérez	juan.perez@correo.com
2	test	test@gmail.com
3	tests1	test1@gmail.com
4	test4	test4@gmail.com
5	test5	test5@gmail.com
6	test7	test7@gmail.com
7	test9	test9@gmail.com
\.


--
-- Data for Name: examen_preguntas; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.examen_preguntas (examen_id, pregunta_id, orden) FROM stdin;
1	1	1
3	2	1
3	4	2
\.


--
-- Data for Name: examenes; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.examenes (id, perfil_id, titulo, tiempo_limite_min) FROM stdin;
1	1	Examen Backend Junior Python	45
2	1	test	80
3	3	Examen Desarollador full stack	60
\.


--
-- Data for Name: intentos; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.intentos (id, candidato_id, examen_id, iniciado_en, finalizado_en, estado) FROM stdin;
1	1	1	2026-09-12 02:14:24.637569	2026-09-12 02:34:48.518256	calificado
2	2	1	2026-09-27 20:43:30.050048	2026-09-27 20:47:00.46219	calificado
3	3	2	2026-10-06 01:17:26.846461	\N	en_progreso
4	3	1	2026-10-06 01:52:05.858998	2026-10-06 01:52:59.390472	calificado
5	3	1	2026-10-06 01:53:44.422212	\N	en_progreso
6	4	3	2026-10-15 00:20:51.476	\N	en_progreso
7	5	2	2026-10-15 01:23:48.175538	\N	en_progreso
8	5	1	2026-10-15 20:00:08.816486	2026-10-15 20:00:24.517081	calificado
9	2	1	2026-10-20 19:20:27.267995	\N	en_progreso
10	6	3	2026-10-21 01:22:27.313172	2026-10-21 01:23:16.085365	calificado
11	7	3	2026-10-21 17:27:02.699759	\N	en_progreso
12	7	1	2026-10-21 17:27:27.254148	\N	en_progreso
13	7	3	2026-10-21 19:50:14.788839	2026-10-21 19:50:32.519637	calificado
\.


--
-- Data for Name: perfiles; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.perfiles (id, nombre, descripcion) FROM stdin;
1	Backend Junior Python	Evaluación para desarrolladores backend junior con Python
2	Frontend Junior React	Evaluación para desarrolladores frontend junior
3	Desarrolladores Full Stack 	Evaluación para desarrolladores full stack
\.


--
-- Data for Name: preguntas; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.preguntas (id, perfil_id, tipo, enunciado, rubrica, opciones, respuesta_correcta) FROM stdin;
1	1	abierta	Explica qué es un decorador en Python y da un ejemplo de uso.	El candidato debe explicar que un decorador es una función que envuelve a otra para extender su comportamiento sin modificar su código. Debe mencionar la sintaxis @nombre_decorador y dar un ejemplo válido (ej. medir tiempo de ejecución, logging, validación de permisos).	null	\N
2	3	abierta	¿Cómo decides entre una arquitectura de monolito o microservicios?	La respuesta ideal sugiere comenzar con un monolito a menos que haya una necesidad clara de escala o equipos grandes, ya que los microservicios introducen complejidad operativa en redes, despliegue y monitoreo.	null	\N
4	3	opcion_multiple	¿Cuál es la principal diferencia entre == y === en JavaScript?		["A) == compara valores y tipos, === solo valores.", "B) === compara valores y tipos (igualdad estricta), == solo valores (igualdad abstracta).", "C) No hay diferencia, son sin\\u00f3nimos.", "D) == es m\\u00e1s r\\u00e1pido en ejecuci\\u00f3n."]	\N
\.


--
-- Data for Name: respuestas; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.respuestas (id, intento_id, pregunta_id, respuesta_texto) FROM stdin;
1	1	1	Un decorador en Python es una función que recibe otra función y le agrega funcionalidad extra sin modificar su código original. Se usa con @nombre_decorador encima de la función. Por ejemplo: @staticmethod se usa para declarar métodos estáticos en una clase.
2	2	1	es una funcion que recibe una funciona y la moldea para dar algun u otro tipo de resultado, un ejemplo de uso seria un decorador de timing que mide cuánto tarda una función en ejecutarse
3	4	1	Un decorador es un patrón de diseño en Python que permite añadir o modificar dinámicamente la funcionalidad de una función, método o clase sin alterar su código fuente.  Técnicamente, es una función que recibe otra función como argumento, la envuelve para extender su comportamiento y devuelve una nueva función. \n\nSe aplican mediante la sintaxis @nombre_decorador colocada justo encima de la definición de la función a decorar.  Esto es equivalente a asignar manualmente el resultado de la función decoradora a la función original.\n\nEjemplo de uso básico\nEl siguiente ejemplo muestra un decorador que imprime mensajes antes y después de la ejecución de la función original:\n\ndef mi_decorador(funcion):\n    def envoltura(*args, **kwargs):\n        print("Antes de ejecutar la función")\n        resultado = funcion(*args, **kwargs)\n        print("Después de ejecutar la función")\n        return resultado\n    return envoltura\n\n@mi_decorador\ndef saludar():\n    print("¡Hola!")\n\nsaludar()\n# Salida:\n# Antes de ejecutar la función\n# ¡Hola!\n# Después de ejecutar la función
4	5	1	no lo se bro
5	5	1	no lo se bro
6	5	1	Un decorador es un patrón de diseño en Python que permite añadir o modificar dinámicamente la funcionalidad de una función, método o clase sin alterar su código fuente.  Técnicamente, es una función que recibe otra función como argumento, la envuelve para extender su comportamiento y devuelve una nueva función. 
7	5	1	Un decorador es un patrón de diseño en Python que permite añadir o modificar dinámicamente la funcionalidad de una función, método o clase sin alterar su código fuente.  Técnicamente, es una función que recibe otra función como argumento, la envuelve para extender su comportamiento y devuelve una nueva función. 
8	6	2	Comienza con un monolito para lanzar rápido y validar; migra a microservicios solo cuando la complejidad, el tamaño del equipo o los requisitos de escalabilidad lo justifiquen.
9	6	4	== compara valores y tipos, === solo valores.
10	6	2	Comienza con un monolito para lanzar rápido y validar; migra a microservicios solo cuando la complejidad, el tamaño del equipo o los requisitos de escalabilidad lo justifiquen.
11	6	4	== compara valores y tipos, === solo valores.
12	8	1	no me acuerdo loco\n
13	9	1	Un decorador en Python es una función que recibe otra función como argumento, modifica su comportamiento y devuelve una nueva función. Se utiliza principalmente para extender la funcionalidad de funciones o métodos sin modificar su código fuente original, permitiendo un código más limpio, modular y reutilizable.
14	10	2	La decisión depende del tamaño del proyecto, la madurez del equipo y los requisitos de escalabilidad.
15	10	4	La diferencia principal es que == realiza coerción de tipos (convierte los operandos a un tipo común antes de comparar), mientras que === no realiza conversiones y verifica que tanto el valor como el tipo de dato sean idénticos.
16	13	2	no se 
17	13	4	A) == compara valores y tipos, === solo valores.
\.


--
-- Data for Name: resultados; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.resultados (id, intento_id, calificacion_total, retroalimentacion_ia) FROM stdin;
1	1	8	Pregunta 1: Excelente explicación del concepto teórico y la sintaxis del decorador. Para obtener la máxima puntuación, habría sido ideal incluir un ejemplo de código práctico o la implementación de un decorador personalizado (como medición de tiempo o registros) en lugar de solo mencionar `@staticmethod`.
2	2	5	Pregunta 1: Comprendes la idea general y mencionaste un buen caso de uso (medir tiempo). Sin embargo, faltó explicar la sintaxis usando el símbolo '@', mencionar que no modifica el código original y proporcionar un ejemplo práctico en código.
3	4	10	Pregunta 1: Respuesta impecable y muy completa. El candidato explicó con claridad el concepto y la sintaxis '@', además de proporcionar un ejemplo técnico perfecto que incluye el manejo correcto de argumentos con *args y **kwargs.
4	8	0	Pregunta 1: El candidato no respondió a la pregunta ni demostró conocimientos sobre los decoradores en Python. Se sugiere repasar cómo envolver funciones para extender su comportamiento, la sintaxis @ y ejemplos prácticos como logging o medición de tiempo.
5	10	8	Pregunta 2: Mencionas factores clave como el tamaño, la madurez del equipo y la escalabilidad. Sin embargo, falta sugerir la recomendación de iniciar con un monolito por defecto y señalar la complejidad operativa (redes, despliegue, monitoreo) que implican los microservicios.\nPregunta 4: La respuesta es precisa, clara y técnicamente correcta. Explica perfectamente el concepto de coerción de tipos para `==` y la comparación estricta de valor y tipo para `===`.
6	13	0.5	Pregunta 2: El candidato no proporcionó una respuesta a la pregunta. Para responder correctamente, se debe explicar que es preferible iniciar con un monolito por su menor complejidad y considerar microservicios solo cuando existan necesidades claras de escala o equipos independientes.\nPregunta 4: La respuesta es incorrecta ya que invierte la definición de los operadores. En JavaScript, '==' compara solo valores realizando conversión de tipos, mientras que '===' compara tanto el valor como el tipo de dato sin realizar conversión.
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: eval_user
--

COPY public.usuarios (id, nombre, email, password_hash, rol) FROM stdin;
1	Admin Principal	admin@develop.com.mx	$2b$12$9y/WqUa1mPECGSktZnbqIu/wIVxB4w4ZPaG1kO.DOaxa0RCvouaPi	admin
2	Roberto Zacatenco	test@gmail.com	$2b$12$dDASOl.qayPNa5u0NBJJYebZGY1Ucu0.C0VLnebGLwsBruD4/v9Qi	admin
3	test2	test2@gmail.com	$2b$12$nXSPW2BN/rGAMQDLLGniGOHcdF.hBRI5j/agnbWmhobfRo4ONtQ8C	admin
4	test3	test3@gmail.com	$2b$12$l9jaYD9mnXPbgXMHw6yATee/PfrH5i3ScHgdQbNGetG6ePubFchmC	evaluador
\.


--
-- Name: candidatos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.candidatos_id_seq', 7, true);


--
-- Name: examenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.examenes_id_seq', 3, true);


--
-- Name: intentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.intentos_id_seq', 13, true);


--
-- Name: perfiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.perfiles_id_seq', 4, true);


--
-- Name: preguntas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.preguntas_id_seq', 4, true);


--
-- Name: respuestas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.respuestas_id_seq', 17, true);


--
-- Name: resultados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.resultados_id_seq', 6, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eval_user
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: candidatos candidatos_email_key; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_email_key UNIQUE (email);


--
-- Name: candidatos candidatos_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.candidatos
    ADD CONSTRAINT candidatos_pkey PRIMARY KEY (id);


--
-- Name: examen_preguntas examen_preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.examen_preguntas
    ADD CONSTRAINT examen_preguntas_pkey PRIMARY KEY (examen_id, pregunta_id);


--
-- Name: examenes examenes_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.examenes
    ADD CONSTRAINT examenes_pkey PRIMARY KEY (id);


--
-- Name: intentos intentos_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.intentos
    ADD CONSTRAINT intentos_pkey PRIMARY KEY (id);


--
-- Name: perfiles perfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.perfiles
    ADD CONSTRAINT perfiles_pkey PRIMARY KEY (id);


--
-- Name: preguntas preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id);


--
-- Name: respuestas respuestas_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pkey PRIMARY KEY (id);


--
-- Name: resultados resultados_intento_id_key; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_intento_id_key UNIQUE (intento_id);


--
-- Name: resultados resultados_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: ix_candidatos_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_candidatos_id ON public.candidatos USING btree (id);


--
-- Name: ix_examenes_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_examenes_id ON public.examenes USING btree (id);


--
-- Name: ix_intentos_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_intentos_id ON public.intentos USING btree (id);


--
-- Name: ix_perfiles_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_perfiles_id ON public.perfiles USING btree (id);


--
-- Name: ix_preguntas_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_preguntas_id ON public.preguntas USING btree (id);


--
-- Name: ix_respuestas_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_respuestas_id ON public.respuestas USING btree (id);


--
-- Name: ix_resultados_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_resultados_id ON public.resultados USING btree (id);


--
-- Name: ix_usuarios_id; Type: INDEX; Schema: public; Owner: eval_user
--

CREATE INDEX ix_usuarios_id ON public.usuarios USING btree (id);


--
-- Name: examen_preguntas examen_preguntas_examen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.examen_preguntas
    ADD CONSTRAINT examen_preguntas_examen_id_fkey FOREIGN KEY (examen_id) REFERENCES public.examenes(id);


--
-- Name: examen_preguntas examen_preguntas_pregunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.examen_preguntas
    ADD CONSTRAINT examen_preguntas_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas(id);


--
-- Name: examenes examenes_perfil_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.examenes
    ADD CONSTRAINT examenes_perfil_id_fkey FOREIGN KEY (perfil_id) REFERENCES public.perfiles(id);


--
-- Name: intentos intentos_candidato_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.intentos
    ADD CONSTRAINT intentos_candidato_id_fkey FOREIGN KEY (candidato_id) REFERENCES public.candidatos(id);


--
-- Name: intentos intentos_examen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.intentos
    ADD CONSTRAINT intentos_examen_id_fkey FOREIGN KEY (examen_id) REFERENCES public.examenes(id);


--
-- Name: preguntas preguntas_perfil_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_perfil_id_fkey FOREIGN KEY (perfil_id) REFERENCES public.perfiles(id);


--
-- Name: respuestas respuestas_intento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_intento_id_fkey FOREIGN KEY (intento_id) REFERENCES public.intentos(id);


--
-- Name: respuestas respuestas_pregunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas(id);


--
-- Name: resultados resultados_intento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eval_user
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_intento_id_fkey FOREIGN KEY (intento_id) REFERENCES public.intentos(id);


--
-- PostgreSQL database dump complete
--

\unrestrict gyJ3OhV8CM2z3AHRGU9zVljzbFhQ4e44umJyEpSByc0OEn6gPCG2MMXcSMR5qcT

