# REDCap File Type Enforcer

A lightweight script that enforces a single file type for all file upload fields in a given REDCap survey instrument. It is not natively achievable to set explicit file upload types in REDCap.

The script applies a valid [file type or unique file type specifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept) to the `accept` attribute of the `<input type="file">` elements underlying the file upload fields.

To specify your desired file type, just replace the second argument in the `registerFileValidation()` function call at the bottom of the script. Paste the code into your project's REDCap JavaScript Injector and configure the rest. Both `main.js` and `minified.js` use `".pdf"` as the default file type.
