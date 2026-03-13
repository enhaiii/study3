CREATE TABLE IF NOT EXISTS areas_seq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

CREATE TABLE IF NOT EXISTS sections_seq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

CREATE TABLE IF NOT EXISTS workers_seq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

INSERT OR IGNORE INTO areas_seq (name) VALUES ('test1'), ('test2'), ('test3');
INSERT OR IGNORE INTO sections_seq (name) VALUES ('test1'), ('test2');
INSERT OR IGNORE INTO workers_seq (name) VALUES ('test1'), ('test2'), ('test3'), ('test4');

SELECT 
    name AS SEQUENCE_NAME,
    9223372036854775807 AS MAX_VALUE,  
    1 AS INCREMENT_BY,                  
    seq AS LAST_NUMBER                  
FROM sqlite_sequence
WHERE name IN ('areas_seq', 'sections_seq', 'workers_seq', 'dept_id_seq')
ORDER BY name;