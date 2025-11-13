--Creacion Enum--
-- Asegurarse de borrar si ya existe y luego crear
DROP TYPE IF EXISTS themes_type CASCADE;
CREATE TYPE themes_type AS ENUM (
    'etapes',
    'arquitectura tematica',
    'barris'
);

--Creacion Tablas--
CREATE TABLE users (
    id_User SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50)
);

CREATE TABLE publications (
    id_Publication SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    themes themes_type NOT NULL,
    acknowledgment TEXT,
    publication_edition VARCHAR(100) NOT NULL
);

CREATE TABLE typology(
    id_Typology SERIAL PRIMARY KEY,
    name VARCHAR(50),
    image VARCHAR(255)
);

CREATE TABLE protection(
    id_Protection SERIAL PRIMARY KEY,
    level VARCHAR(25),
    description TEXT
);

CREATE TABLE prizes(
    id_Prize SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tipe VARCHAR(255),
    year SMALLINT,
    description TEXT
);

CREATE TABLE architects (
    id_Architect SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE reform (
    id_Reform SERIAL PRIMARY KEY,
    year SMALLINT,
    id_Architect INT NOT NULL,
    CONSTRAINT fk_Cliente FOREIGN KEY (id_Architect)
      REFERENCES architects (id_Architect)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE TABLE nomenclature (
    id_Nomenclature SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT
);

CREATE TABLE buildings (
    id_Building SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    picture VARCHAR(200) NOT NULL,
    coordinates VARCHAR(200) NOT NULL,
    constuction_year SMALLINT NOT NULL,
    description TEXT,
    surface_area INT,
    id_Prize INT,
    id_Nomenclature INT,
    id_Publication INT NOT NULL,
    id_Reform INT,
    id_Architect INT,
    id_Typology INT,
    id_Protection INT,
    CONSTRAINT fk_Prize FOREIGN KEY (id_Prize) REFERENCES prizes (id_Prize) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Nomenclature FOREIGN KEY (id_Nomenclature) REFERENCES nomenclature (id_Nomenclature) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Publication FOREIGN KEY (id_Publication) REFERENCES publications (id_Publication) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Reform FOREIGN KEY (id_Reform) REFERENCES reform (id_Reform) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Architect FOREIGN KEY (id_Architect) REFERENCES architects (id_Architect) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Typology FOREIGN KEY (id_Typology) REFERENCES typology (id_Typology) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Protection FOREIGN KEY (id_Protection) REFERENCES protection (id_Protection) ON DELETE RESTRICT ON UPDATE CASCADE
);

--Tabla intermedia Publications-Buildings--
CREATE TABLE publication_building (
    id_Publication INT NOT NULL,
    id_Building INT NOT NULL,
    PRIMARY KEY (id_Publication, id_Building),
    CONSTRAINT fk_Publication FOREIGN KEY (id_Publication)
      REFERENCES publications (id_Publication)
      ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Building FOREIGN KEY (id_Building)
      REFERENCES buildings (id_Building)
      ON DELETE RESTRICT ON UPDATE CASCADE
);
--Tabla intermedia Building-Prizes--
CREATE TABLE building_prizes (
    id_Building INT NOT NULL,
    id_Prize INT NOT NULL,
    PRIMARY KEY (id_Building, id_Prize),
    CONSTRAINT fk_Building_Prize FOREIGN KEY (id_Building)
      REFERENCES buildings (id_Building)
      ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_Prize_Building FOREIGN KEY (id_Prize)
      REFERENCES prizes (id_Prize)
      ON DELETE RESTRICT ON UPDATE CASCADE
);