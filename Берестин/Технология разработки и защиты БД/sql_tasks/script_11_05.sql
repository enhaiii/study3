CREATE VIEW recipes_details AS
SELECT 
    r.id AS recipe_id,
    r.title AS recipe_title,
    r.description,
    r.cooking_time,
    r.complexity,
    r.weight,
    n.name AS nationality,
    t.title AS type,
    a.full_name AS author
FROM recipes r
LEFT JOIN nationalities n ON r.nationality_id = n.id
LEFT JOIN types t ON r.type_id = t.id
LEFT JOIN authors a ON r.id = a.recipe_id;

CREATE VIEW ingredients_nutrition AS
SELECT 
    i.id AS ingredient_id,
    i.title AS ingredient_name,
    i.weight,
    i.supplier,
    i.expiration_date,
    i.category,
    n.calories,
    n.proteins,
    n.fats,
    n.carbohydrates,
    n.sugar,
    n.fiber
FROM ingredients i
LEFT JOIN nutritionals n ON i.nutritional_id = n.id;

CREATE VIEW recipe_steps AS
SELECT 
    r.id AS recipe_id,
    r.title AS recipe_title,
    s.title AS step_number,
    s.description AS step_description,
    s.equipment,
    s.technic
FROM recipes r
JOIN steps s ON r.id = s.recipe_id
ORDER BY r.id, s.title;

SELECT 
    v.name AS VIEW_NAME,
    v.sql AS TEXT
FROM sqlite_master v
WHERE v.type = 'view'
    AND v.name NOT LIKE 'sqlite_%'
ORDER BY v.name;