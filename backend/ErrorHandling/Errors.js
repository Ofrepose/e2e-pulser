class Errors {
    constructor() { }
    // severities: log, warn, halt;
  
  
  
    
    /**
   * Creates a new custom error with optional parameters for name, data, severity, tag, and msg.
   * If the `msg` argument is not provided, it defaults to 'Custom Error'.
   * The error object includes the specified name, data, severity, tag, and msg properties.
   * The stack trace is captured at the location where it is called.
   * Depending on the severity, the error is logged or thrown.
   * @param {Object} param - Object with optional properties: name, data, severity, tag, and msg.
   */
    newError({ name = 'customError', data, severity = 'log', tag = 'default', msg = 'No msg provided', loc= 'no location provided', error }) {
      let err = new Error(msg || 'Custom Error');
      Error.captureStackTrace(err, this.notNullAnyArgs || this.newError);
      err.name = name;
      err.data = data || 'no data received';
      err.severity = severity;
      err.tag = tag;
      err.msg = msg || error?.message;
      err.loc = loc || error?.stack;
  
      
  
      switch (severity) {
        case 'log':
          console.log(err);
          break;
        case 'warn':
          console.warn(err);
          break;
        default:
          throw err;
      }
    }
  
  
    /**
   * Checks if the provided arguments are not null or undefined.
   * If the arguments are provided as an array, each element in the array is checked.
   * If the arguments are provided as an object, each property in the object is checked.
   * If any argument is null or undefined, it throws a new error with the details.
   * @param {Array|Object} args - The arguments to check for null or undefined values.
   */
    notNullAnyArgs(args, loc) {
  
      // TODO: Refactor this using DRY
  
  
      if (Array.isArray(args)) {
        console.log('is array')
        for (let arg of args) {
          if (!arg) {
            this.newError({
              name: 'missing argument',
              data: args,
              severity: 'halt',
              tag: 'general',
              msg: 'missing argument required',
              loc
            })
          }
        }
      } else {
        for (let arg of Object.keys(args)) {
          if (!args[arg]) {
            this.newError({
              name: 'missing argument',
              data: args,
              severity: 'halt',
              tag: 'general',
              msg: 'missing argument required',
              loc
            });
          }
        }
      }
    }
  
  
    /**
    * Validates that all arguments in the provided array or object are not null or undefined.
    * Throws an error if ALL arguments are null or undefined.
    * @param {Array|Object} args - An array or object containing the arguments to validate.
    */
    notNullAllArgs(args, loc) {
  
      const iterateArgs = (argList) => {
        if (!argList.some((value) => value != null && value != undefined )) {        
          this.newError({
            name: 'missing argument',
            data: args,
            severity: 'halt',
            tag: 'general',
            msg: 'missing argument required',
            loc
          })
        }
  
      }
  
      if (Array.isArray(args)) {
        iterateArgs(args);
      } else {
        iterateArgs(Object.values(args));
      }
  
    }
  }
  
  module.exports = Errors;