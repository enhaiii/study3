CREATE TABLE comments (
    table_name TEXT PRIMARY KEY,
    comments TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (table_name, comments) 
VALUES ('recipes', 'Информация о рецептах');

SELECT comments
FROM comments
WHERE table_name = 'recipes';

SELECT 
    table_name,
    comments
FROM comments
ORDER BY table_name;