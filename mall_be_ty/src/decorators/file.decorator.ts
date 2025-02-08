import { ApiBody } from "@nestjs/swagger"

export const uploadFile = (filename:string = 'file'): MethodDecorator => (
    target: any, 
    propertyKey, 
    descriptor: PropertyDescriptor
) => {
    ApiBody({
        schema: {
            type: 'object',
            properties: {
                [filename]: {
                    type: 'string',
                    format: "binary"
                }
            }
        }
    })(target, propertyKey, descriptor)
}