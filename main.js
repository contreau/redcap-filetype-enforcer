document.addEventListener("DOMContentLoaded", () => {
  // * EDIT THE CONFIG BEFORE APPLYING THIS CODE TO YOUR PROJECT
  // - The number of comma-separated strings in this array MUST match the number of file upload fields you have in your project.
  // - If specifying multiple file types for a single field, the string content itself should be comma-separated.
  const config = {
    acceptAttributeValues: [".pdf"],
  };

  // * Click event callback
  function setInputAcceptAttribute(filetype) {
    const fileUploadInput = document.querySelector(
      "form#form_file_upload div#f1_upload_form div input",
    );
    if (fileUploadInput.getAttribute("accept") === null) {
      fileUploadInput.setAttribute("accept", filetype);
    }
  }

  // * Registers click events and mutation observers for each file field type
  function registerFileValidation(fileField, filetype) {
    // * Case 1: Initial click event assignment
    const uploadButton = fileField.querySelector(`a.fileuploadlink`);
    uploadButton.addEventListener("click", () => {
      setInputAcceptAttribute(filetype);
    });

    // * Case 2: A file is already uploaded, but the user chooses to either upload a new file (in-place replacement) or delete the current one.
    // - The upload link (a.fileuploadlink) re-renders when a file is uploaded, which removed the click event that we initially assigned it.
    // - Observe its parent div for that mutation, and add back the click event assignment to a.fileuploadlink.
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          const uploadButton = fileField.querySelector(`a.fileuploadlink`);
          uploadButton.addEventListener("click", () => {
            setInputAcceptAttribute(filetype);
          });
        }
      }
    });
    const fieldName = fileField.getAttribute("sq_id");
    const parentContainerOfUploadButton = fileField.querySelector(`#${fieldName}-linknew`);
    observer.observe(parentContainerOfUploadButton, { childList: true });
  }

  // * Execution and error handling
  try {
    const fileFields = document.querySelectorAll(`tr[fieldtype="file"]`);
    const lengthDifference = fileFields.length - config.acceptAttributeValues.length;
    const absoluteDiff = Math.abs(lengthDifference);
    const hasSingleFileType = config.acceptAttributeValues.length === 1;
    if (!Array.isArray(config.acceptAttributeValues)) {
      throw new Error(
        `The 'acceptAttributeValues' value in the config must be an array [] of one or more strings. Correct formatting example: [".pdf"]`,
      );
    }
    if (lengthDifference > 0 && !hasSingleFileType) {
      throw new Error(
        `The number of strings you provided in the 'acceptAttributeValues' is LESS than the amount of file upload fields in your project. Add ${absoluteDiff} more file type string(s) to the config.`,
      );
    } else if (lengthDifference < 0) {
      console.warn(
        `The number of strings you provided in 'acceptAttributeValues' exceeds the amount of file upload fields in your project by ${absoluteDiff}. The last ${absoluteDiff} file type(s) in your config will not be applied to any field of your project.`,
      );
    } else if (config.acceptAttributeValues.length === 0) {
      throw new Error(
        `File types not specified in the config. Specify desired file types as a string within the 'acceptAttributeValues' array (example: [".pdf"]).`,
      );
    } else if (hasSingleFileType && config.acceptAttributeValues[0] === "") {
      throw new Error(
        `An empty string was passed in 'acceptAttributeValues'. Add a valid file type string to enforce file type uploads.`,
      );
    }
    for (let i = 0; i < fileFields.length; i++) {
      const filetype = hasSingleFileType
        ? config.acceptAttributeValues[0]
        : config.acceptAttributeValues[i];
      registerFileValidation(fileFields[i], filetype);
    }
  } catch (e) {
    console.error(e);
  }
});
