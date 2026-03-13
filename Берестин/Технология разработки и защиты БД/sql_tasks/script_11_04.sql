CREATE VIEW emp AS SELECT * FROM authors;
CREATE VIEW staff AS SELECT * FROM ingredients;
CREATE VIEW workers AS SELECT * FROM nationalities;

SELECT * FROM sqlite_master WHERE type = 'view';

SELECT 
    name AS SYNONYM_NAME,
    'user' AS TABLE_OWNER,
    substr(sql, instr(sql, 'SELECT * FROM ') + 14) AS TABLE_NAME,
    NULL AS DB_LINK
FROM sqlite_master 
WHERE type = 'view'
    AND name NOT LIKE 'sqlite_%'
ORDER BY name;