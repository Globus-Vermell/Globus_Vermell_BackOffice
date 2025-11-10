INSERT INTO users (id_User, name, email, password) VALUES
(1, 'Pol Paredes', 'pol.paredes@example.com', 'changeme');

INSERT INTO typology (id_Typology, name, image) VALUES
(1, 'Residencial', '/images/typology/residencial.jpg');

INSERT INTO protection (id_Protection, level, description) VALUES
(1, 'Alto', 'Protección histórica alta');

INSERT INTO prizes (id_Prize, name, tipe, year, description) VALUES
(1, 'Premio Nacional Ejemplo', 'Nacional', 2020, 'Descripción del premio');

INSERT INTO architects (id_Architect, name, description) VALUES
(1, 'Arquitecto Uno', 'Arquitecto principal del proyecto');

INSERT INTO nomenclature (id_Nomenclature, name, description) VALUES
(1, 'Nomenclatura A', 'Descripción nomenclatura');

INSERT INTO publications (id_Publication, title, description, themes, acknowledgment, publication_edition) VALUES
(1, 'Revista Vermell', 'Descripción de ejemplo', 'hola', 'Agradecimientos', 'Edición 1');

INSERT INTO reform (id_Reform, year, id_Architect) VALUES
(1, 2019, 1);

INSERT INTO buildings (
  id_Building, name, picture, coordinates, constuction_year, description,
  surface_area, id_Prize, id_Nomenclature, id_Publication, id_Reform,
  id_Architect, id_Typology, id_Protection
) VALUES
(1, 'Edificio Central', '/images/buildings/central.jpg', '41.387,-0.169', 1999,
 'Descripción del edificio central', 1200, 1, 1, 1, 1, 1, 1, 1);

INSERT INTO publication_building (id_Publication, id_Building) VALUES
(1, 1);