
function maskPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return phoneNumber;

  const cleanedNumber = phoneNumber.replace(/\D/g, '');
  const visibleDigits = 4;
  const maskedLength = cleanedNumber.length - visibleDigits;

  if (maskedLength <= 0) return phoneNumber;

  const mask = '*'.repeat(maskedLength);
  return mask + cleanedNumber.slice(-visibleDigits);
}

export function LogDecorator() {

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const req = args[0];
      const body = req.body;
      const maskedBody = { ...body };

      if (maskedBody.phone) {
        maskedBody.phone = maskPhoneNumber(maskedBody.phone);
      }

      const logMessage = `Incoming request: ${req.method} ${req.originalUrl}\nRequest body: ${JSON.stringify(maskedBody)}`;

      console.log(logMessage);

      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.then((res) => {
           console.log(`Outgoing response: ${res ? JSON.stringify(res): 'void'}`);
          return res;
        }).catch(err => {
          console.error(`Error in request: ${err}`);
          throw err;
        });
      } else {
        console.log(`Outgoing response: ${result ? JSON.stringify(result): 'void'}`);
        return result;
      }
    };
    return descriptor;
  };
}