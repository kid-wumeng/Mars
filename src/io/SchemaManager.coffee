_ = require('lodash')
SchemaFormater = require('./SchemaFormater')
SchemaSplicer = require('./SchemaSplicer')



class SchemaManager



SchemaManager.dict = null



SchemaManager.save = (schemaDict) ->
  @dict = schemaDict



SchemaManager.formatBaseSchemaDict = () ->
  for name, schema of @dict
    # 基本属性
    schema.createDate = Date
    schema.uodateDate = Date
    schema.removeDate = Date
    schema.restoreDate = Date
    SchemaFormater.formatLogogram(schema)
  @dict = SchemaSplicer.spliceDict(@dict)
  for name, schema of @dict
    @dict[name] = SchemaFormater.formatLinear(schema)



SchemaManager.formatIOSchema = (schema) ->
  SchemaFormater.formatLogogram(schema)
  schema = SchemaSplicer.splice(schema, @dict)
  return SchemaFormater.formatLinear(schema)



module.exports = SchemaManager