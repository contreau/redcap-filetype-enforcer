# REDCap File Type Enforcer

A lightweight script that enforces specified file types for any file upload fields in a given REDCap survey instrument. It is not natively achievable to set explicit file upload types in REDCap.

The script applies one or more valid file type or unique file type specifier to the `accept` attribute of the `<input type="file" />` elements underlying the file upload fields. Please refer to the [official MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept) on how to specify these values properly.

## Configuration

To specify your desired file type, edit the `acceptAttributeValues` array of the `config` object near the top of the script. Paste the code into your project's REDCap JavaScript Injector and configure the rest. Both `main.js` and `minified.js` use `".pdf"` as the default file type.

The following example is configured for 3 file upload fields, of which the last 2 support multiple file types. The file types are applied to their respective file upload fields in normal descending order.

The value of the `acceptAttributeValues` key MUST be an array `[]` of one or more valid file type strings.

**Note**: If only one valid string is in the array, that file type will be enforced for all of the file upload fields in the instrument. Otherwise, the number of strings in the array MUST be the same as the number of file upoad fields in your instrument.

```
// Example
const config = {
  acceptAttributeValues: [".pdf", "image/*, video/*", ".doc, .docx, .pdf"],
};
```

**Result:** The first upload field accepts only PDFs; the second upload field accepts only image and video files; and the third upload field accepts only Word documents or PDFs.

### Behavior to Note

- If `config` contains more file type values than there are actual upload fields, type enforcement will only apply to the first n fields matching the number of values in `config`.
- Conversely, if there are more upload fields than there are file type values specified in `config`, no type enforcement will apply.
- **Check the Browser Console** if you encounter unexpected behavior. Specific error or warning messages describing your issue will appear.
