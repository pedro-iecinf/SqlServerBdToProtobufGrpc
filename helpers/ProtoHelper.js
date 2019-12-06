var fs = require('fs');

const getSchemaBd = require('./DbHelper.js').getSchemaBd;
const getTablesBd = require('./DbHelper.js').getTablesBd;
const protoConstants = require('../config/proto.js').protoConstants;

const createProtoSchema = () => {

    createFolderProto();

    getTablesBd().then((data) => {
    
        for (let i = 0; i < data.recordset.length; i++) {
            createSysntaxProto(data.recordset[i].name)
        }
     
     });
}

const createSysntaxProto = async (tableName) => {

    const { namespace, folderRoute, extention, folderName } = protoConstants;

    await getSchemaBd(tableName)
    .then(data => {

        let syntax = `syntax = "proto3";\n\n`;
        const relationShip =  data.recordset.filter(x => x.objectOrArrayObject == "arrayObject" || x.objectOrArrayObject == "object");

        relationShip.forEach(element => {
            
            const { attribute, type, objectOrArrayObject } = element;
            syntax = syntax + `import "${folderName}/${attribute}${extention}";\n`
        });

        syntax = syntax + `\noption csharp_namespace = "${namespace}";\n\nmessage ${tableName+'Proto'} {\n\n`;

        for (let i = 0; i < data.recordset.length; i++) {

            const { attribute, type, objectOrArrayObject } = data.recordset[i];

            switch (type) {
                case 'nvarchar':
                    syntax = syntax + '\t' + 'string ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'varchar':
                    syntax = syntax + '\t' + 'string ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'char':
                    syntax = syntax + '\t' + 'string ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'datetime':
                    syntax = syntax + '\t' + 'string ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'date':
                    syntax = syntax + '\t' + 'string ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'timestamp':
                    syntax = syntax + '\t' + 'string ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'bigint':
                    syntax = syntax + '\t' + 'int64 ' + attribute +' = '+ (i+1) + ';\n'
                    break;
                case 'int':
                    syntax = syntax + '\t' + 'int32 ' + attribute +' = ' + (i+1) + ';\n'
                    break;
                case 'float':
                    syntax = syntax + '\t' + 'float ' + attribute +' = ' + (i+1) + ';\n'
                    break;
                case 'bit':
                    syntax = syntax + '\t' + 'bool ' + attribute +' = ' + (i+1) + ';\n'
                    break;
                default:
                    if(objectOrArrayObject == 'arrayObject') syntax = syntax + '\t' + 'repeated ' + type + 'Proto' + ' ' + attribute +' = ' + (i+1) + ';\n'
                    else if(objectOrArrayObject == 'object') syntax = syntax + '\t' + type + 'Proto' + ' ' + attribute +' = ' + (i+1) + ';\n'
                    break;
            }
            
        }

        syntax = syntax + '}';

        fs.writeFile(`${folderRoute}${tableName.toLowerCase()}${extention}`, syntax , (err) => err);
    })
}

const createFolderProto = () => {

    const { folderName } = protoConstants;

    const dir = `./${folderName}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

module.exports.createProtoSchema = createProtoSchema;