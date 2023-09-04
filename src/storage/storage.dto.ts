//TODO: check user existance
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  ValidationArguments,
  IsNotEmpty,
} from 'class-validator';
import * as Multer from 'multer';

@ValidatorConstraint({ async: true })
export class IsProvidedConstraint implements ValidatorConstraintInterface {
  async validate(data: Array<Multer.File>, args: ValidationArguments) {
    return data != null && data.length > 0;
  }

  defaultMessage() {
    return 'No files provided';
  }
}

export function IsProvided(ValidationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    name: 'IsProvided';
    target: object.constructor;
    propertyName: propertyName;
    ValidationOptions: ValidationOptions;
  };
}

export class UploadFileDto {
  override: string | undefined;
}
