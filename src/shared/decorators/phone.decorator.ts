import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom decorator to validate Moldova phone numbers
 * Valid formats:
 * - +373XXXXXXXX (e.g. +37369123456)
 * - +373 XX XXX XXX (e.g. +373 69 123 456)
 * - 0XXXXXXXX (e.g. 069123456)
 * - International format without + (e.g. 37369123456)
 * @param validationOptions - Standard class-validator options
 */
export function IsMdPhoneNumber(options?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsMdPhoneNumber',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          if (!value) return true;

          if (typeof value !== 'string') return false;

          const cleanedNumber = value.replace(/[\s\-\(\)]/g, '');
          const pattern1 = /^\+373[0-9]{8}$/;
          const pattern2 = /^0[0-9]{8}$/;
          const pattern3 = /^373[0-9]{8}$/;

          return (
            pattern1.test(cleanedNumber) ||
            pattern2.test(cleanedNumber) ||
            pattern3.test(cleanedNumber)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid Moldova phone number`;
        },
      },
    });
  };
}
