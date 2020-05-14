"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// type - object of types
exports.type = {
    'number': 'number',
    'object': 'object',
    'array': 'array',
    'boolean': 'boolean',
    'date': 'date',
    'string': 'string',
    'undefined': 'undefined',
    'null': 'null',
    'function': 'function'
};
// trace - will trace error path
var trace = [];
// IOptions - which will allow to do strict check
var validatorConfig = { allowUnknown: true };
/**
 * validateType - validates value and type
 * @param value - value
 * @param schema - schema
 * @param valueType - type of value
 * @param schemaType - type defined in schema
 * @returns string | null - if schema and value mismatch then it will return error message else null
 */
function validateType(value, schema, valueType, schemaType) {
    if (schemaType != exports.type.object || !schema.type) {
        return buildErrorMessage(value, valueType, schemaType);
    }
    var shType = findType(schema.type);
    if (valueType !== shType) {
        return buildErrorMessage(value, valueType, shType);
    }
    return null;
}
/**
 * buildErrorMessage - will constructs error message
 * @param value - any value
 * @param valueType - type of value
 * @param schemaType - schema type for value
 * @returns string - will return constructed error message
 */
function buildErrorMessage(value, valueType, schemaType) {
    return "required type '" + schemaType + "' for value '" + JSON.stringify(value) + "' but found '" + valueType + "' at path " + trace.join('.');
}
/**
 * validate - will compare json object and defined schema
 * @param value - json object
 * @param schema - schema definition
 * @param IOptions - Validator configuration object
 * @returns string | null - if any schema fails it will return string otherwise null.
 * <pre><code>
 * const { validate } = require('@vasuvanka/json-validator')
 * const json = { name : "hello world" };
 * const jsonSchema = { name: { type : String } };
 * // options is an optional parameter
 * const options = {allowUnkown:false}
 * const error = validate(json,jsonSchema, options)
 * if(error){
 *  console.log(`Got error : ${error}`)
 * }
 * </code></pre>
 * */
function validate(value, schema, options) {
    validatorConfig = Object.assign(validatorConfig, (options || {}));
    trace.length = 0;
    var error = validateData(value, schema);
    return error;
}
exports.validate = validate;
/**
 * validateData - validate json object aganist schema defined
 * @param value - json object
 * @param schema - schema definition
 * @returns string | null - if any schema fails it will return string otherwise null.
 */
function validateData(value, schema) {
    var valueType = findType(value);
    var schemaType = findType(schema);
    var error = null;
    switch (valueType) {
        case exports.type.string:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.number:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.boolean:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.date:
            error = validateType(value, schema, valueType, schemaType);
            break;
        case exports.type.object:
            if (schemaType != exports.type.object) {
                error = buildErrorMessage(value, valueType, schemaType);
            }
            if (Object.keys(schema).length === 0) {
                error = "found '" + valueType + "' for value '" + JSON.stringify(value) + "' but no schema definition found : " + trace.join('.');
            }
            if (!error) {
                var keys = Object.keys(value);
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    trace.push(key);
                    if (!schema[key]) {
                        if (validatorConfig.allowUnknown) {
                            continue;
                        }
                        else {
                            error = "no schema definition found for value " + JSON.stringify(value[key]) + " : " + trace.join('.');
                        }
                    }
                    if (!error) {
                        error = validateData(value[key], schema[key]);
                        if (error != null) {
                            break;
                        }
                    }
                    trace.pop();
                }
            }
            break;
        case exports.type.array:
            if (findType(schema) !== exports.type.array) {
                error = buildErrorMessage(value, valueType, schemaType);
            }
            if (schema.length == 0) {
                error = "no schema definition found for value " + JSON.stringify(value) + " at path " + trace.join('.');
            }
            if (!error) {
                for (var index = 0; index < value.length; index++) {
                    var subValue = value[index];
                    trace.push("[" + index + "]");
                    error = validateData(subValue, schema[0]);
                    if (error != null) {
                        break;
                    }
                    trace.pop();
                }
            }
            break;
        default:
            error = "no schema definition found for value " + JSON.stringify(value) + " at path " + trace.join('.');
            break;
    }
    return error;
}
/**
 * findType - will return type of given value
 * @param value : any
 * @returns string
 */
function findType(value) {
    var valueType = typeof value;
    if (valueType === exports.type.string) {
        if (!isNaN(Date.parse(value))) {
            return exports.type.date;
        }
        return valueType;
    }
    if (valueType === exports.type.object) {
        if (value instanceof Array && Array.isArray(value)) {
            return exports.type.array;
        }
        else if (value === null) {
            return exports.type.null;
        }
        else if (value instanceof Date) {
            return exports.type.date;
        }
        else if (value instanceof Number) {
            return exports.type.number;
        }
        else if (value instanceof String) {
            return exports.type.string;
        }
        else if (value instanceof Boolean) {
            return exports.type.boolean;
        }
        return valueType;
    }
    if (valueType === exports.type.function && value.name) {
        return value.name.toLowerCase();
    }
    return valueType;
}
exports.findType = findType;
