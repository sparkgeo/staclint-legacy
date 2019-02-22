import { parseTupleError } from '.';

const checkTupleRe = /^\(.*\)$/;
const checkArrayErrorRe = /is not of type 'array'/;

// Does the API return a stringified python tuple?
const tupleFormattedError = message => message.match(checkTupleRe);

export default message => {
  if (tupleFormattedError(message)) {
    if (message.match(checkArrayErrorRe)) {
      return "'collection' is not of type 'Array'";
    }
    const parsedError = parseTupleError(message);
    if (parsedError.length > 1) {
      return parsedError
        .map(i => `${i}</span><br /><span class="code">`)
        .join('')
        .replace(/<\/span><br \/><span class="code">$/, '');
    }

    return parsedError;
  } else {
    return message;
  }
};
