const executeQuery = require('../config/db.js').executeQuery;

const getSchemaBd = async (tableName) => {

    const result = await executeQuery(`declare @table_name varchar(50)
    set @table_name = '${tableName}'
    
    select *,
    case
        when tableSchema.primary_key_object_id = fk_object_id and primary_key_column_id = fk_column_id and tableSchema.primary_key_object_id !=0 
            then 'object'
        when tableSchema.primary_key_object_id = fk_object_id and primary_key_column_id != fk_column_id and tableSchema.primary_key_object_id !=0 
            then 'arrayObject'
    end as 'objectOrArrayObject'
    
    from (
    Select lower(a.name) as 'attribute', c.name as 'type', '' as primary_key,
    '' as primary_key_object_id, '' as primary_key_column_id,
    '' as fk_object_id, '' as fk_column_id,
    a.isnullable
    
    from sys.syscolumns as a 
        left join sys.tables as b On a.id = b.object_id 
        left join sys.systypes  as c on a.xtype = c.xtype and c.status = 0
    Where b.name = @table_name
    
    union
    
    SELECT
    lower(child.name) AS 'attribute',
    child.name as 'type',
    
    (SELECT 
    COL_NAME(ic.OBJECT_ID,ic.column_id) AS ColumnName
    FROM sys.indexes AS i 
    INNER JOIN sys.index_columns AS ic ON i.OBJECT_ID = ic.OBJECT_ID AND i.index_id = ic.index_id and i.is_primary_key = 1
    and i.object_id = fkc.parent_object_id) as primary_key, --primay key de cada tabla
    
    (SELECT 
    ic.OBJECT_ID
    FROM sys.indexes AS i 
    INNER JOIN sys.index_columns AS ic ON i.OBJECT_ID = ic.OBJECT_ID AND i.index_id = ic.index_id and i.is_primary_key = 1
    and i.object_id = fkc.parent_object_id) as primary_key_object_id, --primay key id de cada tabla
    
    (SELECT 
    ic.column_id
    FROM sys.indexes AS i 
    INNER JOIN sys.index_columns AS ic ON i.OBJECT_ID = ic.OBJECT_ID AND i.index_id = ic.index_id and i.is_primary_key = 1
    and i.object_id = fkc.parent_object_id) as primary_key_column_id, --primay key id de cada tabla
    
    (SELECT top 1
           fc.parent_object_id
    FROM sys.foreign_keys AS fk
    INNER JOIN sys.foreign_key_columns AS fc ON fk.OBJECT_ID = fc.constraint_object_id
    where fc.parent_object_id = fkc.parent_object_id ) as fk_object_id,
    
    (SELECT top 1
           fc.parent_column_id as column_id
    FROM sys.foreign_keys AS fk
    INNER JOIN sys.foreign_key_columns AS fc ON fk.OBJECT_ID = fc.constraint_object_id
    where fc.parent_object_id = fkc.parent_object_id ) as fk_colum_id,
    '' as 'isnullable'
    
    FROM sys.foreign_key_columns fkc
    INNER JOIN sysobjects child ON child.id = fkc.parent_object_id
    INNER JOIN sysobjects parent ON parent.id = fkc.referenced_object_id
    INNER JOIN syscolumns c_colums ON c_colums.id = fkc.parent_object_id
    AND c_colums.colid = parent_column_id
    INNER JOIN syscolumns p_colums ON p_colums.id = fkc.referenced_object_id
        AND p_colums.colid = fkc.referenced_column_id
    where parent.name = @table_name) as tableSchema
    `);
    
    return result;
}

const getTablesBd = async () => {

    const result = await executeQuery(`select name
                                        from sys.tables
                                        where name != '__EFMigrationsHistory' and name != 'sysdiagrams'`);
    return await result;
}

const getRelationship = async tableName => {

    const result = await executeQuery(`declare @table_name varchar(50)
    set @table_name = '${tableName}'
    
    SELECT
    child.name as 'Relationship'
    
    FROM sys.foreign_key_columns fkc
    INNER JOIN sysobjects child ON child.id = fkc.parent_object_id
    INNER JOIN sysobjects parent ON parent.id = fkc.referenced_object_id
    INNER JOIN syscolumns c_colums ON c_colums.id = fkc.parent_object_id
    AND c_colums.colid = parent_column_id
    INNER JOIN syscolumns p_colums ON p_colums.id = fkc.referenced_object_id
        AND p_colums.colid = fkc.referenced_column_id
    where parent.name = @table_name`);
    return await result;
}

module.exports.getSchemaBd = getSchemaBd;
module.exports.getTablesBd = getTablesBd;
module.exports.getRelationship = getRelationship;