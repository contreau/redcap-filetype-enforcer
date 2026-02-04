# REDCap File Type Enforcer

A drop-in script that enforces specified file types for any file upload fields in a given REDCap survey instrument. It is not natively achievable to set explicit file upload types in REDCap.

The script applies one or more valid file type or unique file type specifier to the `accept` attribute of the `<input type="file" />` elements underlying the file upload fields. Please refer to the [official MDN documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept) on how to specify these values properly.

## Configuration

### Step 1. Edit the script

You can specify your desired file types for one survey page or, if you have multiple, each page of your survey. Edit the `config` object near the top of the script following the rules below. Both `script.js` and `min.js` use `".pdf"` as the default file type.

- The `config` object follows zero-based indexing, so the first key MUST be `page0` , with subsequent pages in ascending order (i.e. `page1, page2, etc.`).
- The value of each `page` key MUST be an array `[]` of one or more valid file type strings.
- **Important**: If only one valid string is in an array, that file type will be enforced for all of the file upload fields on that page. Otherwise, the number of strings in an array MUST be the same as the number of file upoad fields on that page.

### Step 2. Set up the JavaScript Injector for your Instrument

- Enable the REDCap JavaScript Injector external module. Open the configuration modal, check the `Enabled` checkbox and paste in the code (or upload a `.js` file).
- Under `Injection Order` , select the `Code from textbox after file` radio button.
- Under `Apply and/or limit to these project pages:` , select `Always On` for the `Surveys` row.
- Under `Inject on this instrument` , choose the name of the instrument you wish to use this script on.

### Behavior to note

- If an array in the `config` contains more file type values than there are actual file fields on its corresponding page, type enforcement will only apply to the first n fields matching the number of values in that array.
- Conversely, if there are more file fields on a page than there are file type values specified in its `config` array, no type enforcement will apply.
- **Check the Browser Console** if you encounter unexpected behavior. Specific error or warning messages describing your issue will appear.

## Examples

### Single-page survey example

This example is configured for a single-page survey and results in PDF-only file type enforcement for any number of file fields on the page.

```
const config = {
  page0: [".pdf"],
};
```

### Multi-page survey example

This example is configured for file fields across 3 pages in a survey. The file types are applied to their respective file fields top-down.

```
const config = {
  page0: [".pdf", "image/*, video/*", ".doc, .docx, .pdf"],
  page1: [".doc, .docx", ".pdf"],
  page2: [".mp4"],
};
```

**Result:** The first page enforces types for three file fields; the second page enforces for 2 file fields; and the third page enforces for 1 file field.
