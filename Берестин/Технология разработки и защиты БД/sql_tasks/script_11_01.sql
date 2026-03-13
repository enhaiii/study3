SELECT 
    ci.name AS COLUMN_NAME,
    ci.type AS DATA_TYPE,
    CASE 
        WHEN ci.type LIKE '%(%)%' THEN 
            substr(ci.type, instr(ci.type, '(') + 1,
                   instr(ci.type, ')') - instr(ci.type, '(') - 1)
        ELSE NULL
    END AS DATA_LENGTH,
    CASE 
        WHEN ci.type LIKE '%(%,%)' THEN
            substr(ci.type, instr(ci.type, '(') + 1,
                   instr(ci.type, ',') - instr(ci.type, '(') - 1)
        WHEN ci.type LIKE '%(%)%' AND ci.type NOT LIKE 'VARCHAR%' THEN
            substr(ci.type, instr(ci.type, '(') + 1,
                   instr(ci.type, ')') - instr(ci.type, '(') - 1)
        ELSE NULL
    END AS PRECISION,
    CASE 
        WHEN ci.type LIKE '%(%,%)' THEN
            substr(ci.type, instr(ci.type, ',') + 1,
                   instr(ci.type, ')') - instr(ci.type, ',') - 1)
        ELSE NULL
    END AS SCALE,
    CASE ci.[notnull]
        WHEN 0 THEN 'Y'
        ELSE 'N'
    END AS "N"
FROM pragma_table_info('recipes') ci
ORDER BY ci.cid;