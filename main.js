document.addEventListener("DOMContentLoaded", () => {
  // ** EDIT THE CONFIG BEFORE APPLYING THIS CODE TO YOUR PROJECT.
  // *
  const config = {
    page0: [".pdf"],
  };

  // *** FUNCTIONS ***

  function setInputAcceptAttribute(filetype) {
    // ** Click event callback.
    // *
    const fileUploadInput = document.querySelector(
      "form#form_file_upload div#f1_upload_form div input",
    );
    if (fileUploadInput.getAttribute("accept") === null) {
      fileUploadInput.setAttribute("accept", filetype);
    }
  }

  function registerFileValidation(fileField, filetype) {
    // * Registers click events and mutation observers for each file field type.
    // *
    // - Case 1: Initial click event assignment
    const uploadButton = fileField.querySelector(`a.fileuploadlink`);
    uploadButton.addEventListener("click", () => {
      setInputAcceptAttribute(filetype);
    });
    // - Case 2: A file is already uploaded, but the user chooses to either upload a new file (in-place replacement) or delete the current one.
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

  function scanForErrors(
    fileFields,
    hasSingleFileType,
    currentAcceptAttributeValues,
    currentPageIndex,
  ) {
    // ** Logs any errors to the console and halts the script.
    // *
    const lengthDifference = fileFields.length - currentAcceptAttributeValues.length;
    const absoluteDiff = Math.abs(lengthDifference);
    if (!Array.isArray(currentAcceptAttributeValues)) {
      throw new Error(
        `The 'page${currentPageIndex}' value in the config must be an array [] of one or more strings. Correct formatting example: [".pdf"]`,
      );
    }
    if (lengthDifference > 0 && !hasSingleFileType) {
      throw new Error(
        `The number of strings you provided in the 'page${currentPageIndex}' array is LESS than the amount of file upload fields in your project. Add ${absoluteDiff} more file type string(s) to the config.`,
      );
    } else if (lengthDifference < 0) {
      console.warn(
        `The number of strings you provided in the 'page${currentPageIndex}' array exceeds the amount of file upload fields in your project by ${absoluteDiff}. The last ${absoluteDiff} file type(s) in the array will not be applied to any field of your project.`,
      );
    } else if (currentAcceptAttributeValues.length === 0) {
      throw new Error(
        `File types not specified in the config. Specify desired file types as a string within the 'page${currentPageIndex}' array (example: [".pdf"]).`,
      );
    } else if (hasSingleFileType && currentAcceptAttributeValues[0] === "") {
      throw new Error(
        `An empty string was passed in the 'page${currentPageIndex}' array. Add a valid file type string to enforce file type uploads.`,
      );
    }
  }

  function configureSessionStorage(newFileFieldIds) {
    // ** Interfaces with session storage to correctly enforce file types across multiple pages
    // *
    const fileFieldsPerPage = sessionStorage.getItem("fileFieldsPerPage");
    if (fileFieldsPerPage === null) {
      sessionStorage.setItem("fileFieldsPerPage", JSON.stringify([newFileFieldIds]));
      return [newFileFieldIds];
    } else {
      // - Stored array exists, so check if the current page's file fields are already stored.
      let storedFileFieldIds = JSON.parse(fileFieldsPerPage);
      let foundMatch = false;
      for (const idArray of storedFileFieldIds) {
        if (JSON.stringify(idArray) === JSON.stringify(newFileFieldIds)) {
          foundMatch = true;
          break;
        }
      }
      if (!foundMatch) {
        // - Add new entry to storage.
        storedFileFieldIds = [...storedFileFieldIds, newFileFieldIds];
        sessionStorage.setItem("fileFieldsPerPage", JSON.stringify(storedFileFieldIds));
      }
      return storedFileFieldIds;
    }
  }

  function determineSurveyPage(fileFieldIds, fieldIdsInSessionStorage) {
    // ** Determines which survey page is active based on the encountered file fields.
    // *
    for (let i = 0; i < fieldIdsInSessionStorage.length; i++) {
      if (JSON.stringify(fieldIdsInSessionStorage[i]) === JSON.stringify(fileFieldIds)) {
        return i;
      }
    }
  }

  // *** EXECUTION ***
  try {
    const currentPageFileFields = document.querySelectorAll(`tr[fieldtype="file"]`);
    const fileFieldIds = Array.from(currentPageFileFields).map((node) => node.id);
    const fieldIdsInSessionStorage = configureSessionStorage(fileFieldIds);
    const currentPageIndex = determineSurveyPage(fileFieldIds, fieldIdsInSessionStorage);
    const currentAcceptAttributeValues = config[`page${currentPageIndex}`];
    const hasSingleFileType = currentAcceptAttributeValues.length === 1;
    scanForErrors(
      currentPageFileFields,
      hasSingleFileType,
      currentAcceptAttributeValues,
      currentPageIndex,
    );
    for (let i = 0; i < currentPageFileFields.length; i++) {
      const filetype = hasSingleFileType
        ? currentAcceptAttributeValues[0]
        : currentAcceptAttributeValues[i];
      registerFileValidation(currentPageFileFields[i], filetype);
    }
  } catch (e) {
    console.error(e);
  }
});
