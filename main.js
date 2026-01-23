// ? NOTE: This code is for UNIFORMLY applying a single file type restriction to all file upload fields on a REDCap instrument. This currently does not allow for granular control.

window.addEventListener("DOMContentLoaded", () => {
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
    // - What's happening: The upload link (a.fileuploadlink) re-renders when a file is uploaded, which removed the click event that we initially gave it.
    // - So, we observe its parent div for that mutation, and add back the click event assignment to a.fileuploadlink.

    // * Observer logic
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

    // * Retrieve the sq_id attribute, which is the Field Name created in the instrument builder. Use it to grab the target container and initiate the observer.
    const fieldName = fileField.getAttribute("sq_id");
    const parentContainerOfUploadButton = fileField.querySelector(`#${fieldName}-linknew`);
    observer.observe(parentContainerOfUploadButton, { childList: true });
  }

  // * Execution: Grab all file field types in the form and apply the above logic. Set the file type as the second argument to registerFileValidation
  const fileFields = document.querySelectorAll(`tr[fieldtype="file"]`);
  for (const field of fileFields) {
    registerFileValidation(field, ".pdf"); // The default file type is set to PDF, but you can replace it with any valid type.
  }
});
