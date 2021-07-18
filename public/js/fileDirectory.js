//?-------------------------------------------------FILES DIRECTORY---------------------------------------------------------------------------------------//

//*-------------- sort modal----------------------------
const sortModal = document.querySelector(".sort-modal");
const sortBtn = document.querySelector(".sort-by");

sortBtn.addEventListener("click", function () {
  sortModal.style.display = "block";
});

window.addEventListener("click", function (e) {
  if (e.target == sortModal) {
    sortModal.style.display = "none";
  }
  if (e.target == addDirectoryModal) {
    addDirectoryModal.style.display = "none";
  }
  if (e.target == rightClickModal) {
    rightClickModal.style.display = "none";
  }
});

//*------------- details icon -> open and close [plus add btn style handle] file + team --------------
const detailsBtn = document.querySelector(".details-btn");
const filesArea = document.querySelector(".files-area");
const previewPane = document.querySelector(".preview-pane");
const closePreview = document.querySelector(".close-preview");
const newBtn = document.querySelector(".new-btn");
const newBtnText = document.querySelector(".new-btn span");
let openDetailsFlag = false;

//dir action btn to view details
detailsBtn.addEventListener("click", function () {
  //open details
  if (!openDetailsFlag) {
    filesArea.style.width = "63vw";
    openDetailsFlag = true;
    detailsBtn.style.backgroundColor = "#eceaea";
    // newBtn.style.color = "white";
    newBtn.style.backgroundColor = "transparent";
  } else {
    //closed details pg
    filesArea.style.width = "82vw";
    openDetailsFlag = false;
    detailsBtn.style.backgroundColor = "transparent";
    newBtn.style.backgroundColor = "#13caed";
  }
  previewPane.classList.toggle("display-none");
});

closePreview.addEventListener("click", function () {
  filesArea.style.width = "82vw";
  previewPane.classList.toggle("display-none");
  openDetailsFlag = false;
  detailsBtn.style.backgroundColor = "transparent";
  newBtn.style.backgroundColor = "#13caed";
});

//*------------- open add to directory modals for both file directory and team one--------------------------------
//newBtn
const addDirectoryOptions = document.querySelector(".add-directory-options");
const addDirectoryModal = document.querySelector(".add-directory-modal");

newBtn.addEventListener("click", function () {
  addDirectoryModal.style.display = "block";
});

// window.addEventListener("click", function (e) {
//   if (e.target == addDirectoryModal) {
//     addDirectoryModal.style.display = "none";
//   }
// });

//*------------------- open new folder modal-----------------------------------------
const newFolderBtn = document.querySelector(".new-folder-btn");
const addDirectoryFolderModal = document.querySelector(
  ".add-directory-folder-modal"
);
const newFolderModalClose = document.querySelectorAll(".folder-modal-close");

newFolderBtn.addEventListener("click", function () {
  addDirectoryFolderModal.style.display = "block";
  addDirectoryModal.style.display = "none";
  // rightClickModal.style.display = "none";
});
newFolderModalClose.forEach((closeModalElement) => {
  closeModalElement.addEventListener("click", function () {
    addDirectoryFolderModal.style.display = "none";
    updateDirectoryFolderModal.style.display = "none";
  });
});

//* --------------file upload handled without need for submit btn --- here handling close of earlier add-directory-modal------------------
const fileUploadForm = document.querySelector(".upload-form");
const fileUploadInput = document.getElementById("upload");
fileUploadInput.addEventListener("change", function(e) {
  fileUploadForm.submit();
})

const fileUploadBtn = document.querySelector(".file-upload-btn");
fileUploadBtn.addEventListener("click", function(e) {
  addDirectoryModal.style.display = "none";
  // rightClickModal.style.display = "none";
})


//* active file / folder or files/folders
let active = [];


//* change values of details pane based on active variable
//* also change links in dir action btns for each active file or folder

const previewSelectedTitle = document.querySelector(".selected-title");
const previewMain = document.querySelector(".preview-main");
const previewInfo = document.querySelector(".preview-info");
const dirActionBtns = document.querySelectorAll(".dir-action-btn");

function changePreview(title, urlPath, id, owner, size, type, created, modified, lastOpened, folderFlag, flag) {
  if(flag == 0) {               //!close the preview
    //change div selected title to File Directory
    previewSelectedTitle.innerHTML =  "<img src=\"../icons/folder.svg\" \/> File Directory";
    //add display-none class to preview-main and preview-info
    previewMain.classList.add("display-none");
    previewInfo.classList.add("display-none");
    //remove dir action btn links
    dirActionBtns[0].href = "#"; //copy
    dirActionBtns[2].href = "#";  //move
    dirActionBtns[3].href = "#";  //download
    dirActionBtns[4].href = "#";  //delete
    //and remove them from display
    dirActionBtns[0].style.display = "none"; //copy
    dirActionBtns[1].style.display = "none"; //paste
    dirActionBtns[2].style.display = "none";  //move
    dirActionBtns[3].style.display = "none";  //download
    dirActionBtns[4].style.display = "none";  //delete
  }
  else {                        //!open the preview and update
    //add to display dir action btn
    dirActionBtns[0].style.display = "flex"; //copy
    dirActionBtns[1].style.display = "flex"; //paste
    dirActionBtns[2].style.display = "flex";  //move
    dirActionBtns[3].style.display = "flex";  //download
    dirActionBtns[4].style.display = "flex";  //delete
    //change div selected title to dataset value
    if(folderFlag === 1) {
      previewSelectedTitle.innerHTML =  `<img src=\"../icons/folder.svg\" /> ${title}`;
      //add folder dir action btn links
      dirActionBtns[0].href = `/files/copy/${id}`; //copy
      dirActionBtns[2].href = `/files/cut/${id}`;  //move
      dirActionBtns[3].href = "#";  //download
      dirActionBtns[4].href = `/files/delete/${id}`;  //delete
    }
    else {
      previewSelectedTitle.innerHTML =  `<img src=\"../icons/file.svg\" /> ${title}`;
      //add file dir action btn links
      dirActionBtns[0].href = `/files/copyFile/${id}`; //copy
      dirActionBtns[2].href = `/files/cutFile/${id}`;  //move
      dirActionBtns[3].href = `/files/downloadFile/${id}`;  //download
      dirActionBtns[4].href = `/files/deleteFile/${id}`;  //delete
    }
    //remove display none from preview-main
    previewMain.classList.remove("display-none");
    //!!!!!!!------------add preview thumbnail to preview-main -> preview--------------------------
    // const preview = document.querySelector(".preview");
    // const image = document.createElement("img");
    // image.src = `${urlPath}`;
    // preview.appendChild(image);
    //!------------------------------------------------------------------------------------
    //remove display none from preview-info
    previewInfo.classList.remove("display-none");
    //update preview-infos according to dataset
    created = created.split("GMT");
    modified = modified.split("GMT");
    if(size !== "- -") {
      size = humanFileSize(size, true);
    }
    let previewInfosValue = document.querySelectorAll(".preview-infos-value");
    previewInfosValue[0].innerHTML = owner;
    previewInfosValue[1].innerHTML = size;
    previewInfosValue[2].innerHTML = type;
    previewInfosValue[3].innerHTML = created[0];
    previewInfosValue[4].innerHTML = modified[0];
    previewInfosValue[5].innerHTML = lastOpened;
  }
}

//* convert bytes size to readable values
function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}




//* select left click event (single click select folder/file + added support for ctrl multiple select)
const folders = document.querySelectorAll(".folder");
const files = document.querySelectorAll(".file");
const selectAllBtn = document.querySelector("#select-all-files");

folders.forEach(folder => {
  folder.addEventListener("click", function(e) {
    e.stopPropagation();
    
    let tpos = active.indexOf(folder);
    // console.log(tpos);
    if(tpos === -1) {
    active.push(folder);
    let valueTitle = folder.getAttribute("data-title");
    let valueOwner = folder.getAttribute("data-owner");
    let valueSize = folder.getAttribute("data-size");
    let valueType = folder.getAttribute("data-type");
    let valueCreated = folder.getAttribute("data-created");
    let valueModified = folder.getAttribute("data-modified");
    let valueLastOpened = folder.getAttribute("data-lastOpened");
    let valueId = folder.getAttribute("data-id");
    // changePreview(folder.dataset.title, "/", folder.dataset.owner, folder.dataset.size, folder.dataset.type, folder.dataset.created, folder.dataset.modified, folder.dataset.lastOpened, 1);
    changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 1, 1);
    }
    else {
      active.splice(tpos, 1);
      // if(active.length == 0) {
      if(tpos == 0) {
      changePreview("title", "/", "id", "owner","size", "type","created","modified", "lastOpened", 1, 0);
      }
      else {
        let temp = active[active.length-1];
        let valueTitle = temp.getAttribute("data-title");
        let valueOwner = temp.getAttribute("data-owner");
        let valueSize = temp.getAttribute("data-size");
        let valueType = temp.getAttribute("data-type");
        let valueCreated = temp.getAttribute("data-created");
        let valueModified = temp.getAttribute("data-modified");
        let valueLastOpened = temp.getAttribute("data-lastOpened");
        let valueId = temp.getAttribute("data-id");
        // changePreview(folder.dataset.title, "/", folder.dataset.owner, folder.dataset.size, folder.dataset.type, folder.dataset.created, folder.dataset.modified, folder.dataset.lastOpened, 1);
        changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 1, 1)
      }
    }
    // console.log(active.length, folders.length, files.length);
    //! add this functionality or not? needed???
    // if(active.length === (folders.length + files.length)) {
    //   selectAllBtn.checked = true;
    // }
    // else {
    //   selectAllBtn.checked = false;
    // }
    folder.classList.toggle("active");
    // console.log(active);
    
    //remove other actives coz it allows selection of multiple items which should only work with ctrl + click
    if(!e.ctrlKey && !e.metaKey) {
      folders.forEach( tempFolder => {
        // console.log(tempFolder === folder);
        if(tempFolder !== folder) {
          tempFolder.classList.remove("active");
          const pos = active.indexOf(tempFolder);
          if(pos !== -1) {
          active.splice(pos, 1);
          }

        }
      });
      files.forEach( tempFile => {
          tempFile.classList.remove("active");
          const pos = active.indexOf(tempFile);
          if(pos !== -1) {
            active.splice(pos, 1);
            }

      });
    }
    // console.log(active);
    if(active.length === (folders.length + files.length)) {
      selectAllBtn.checked = true;
    }
    else {
      selectAllBtn.checked = false;
    }
  })
});

files.forEach(file => {
  file.addEventListener("click", function(e) {
    e.stopPropagation();
    let tpos = active.indexOf(file);
    // console.log(tpos);
    if(tpos === -1) {
    active.push(file);
    let valueTitle = file.getAttribute("data-title");
    let valueOwner = file.getAttribute("data-owner");
    let valueSize = file.getAttribute("data-size");
    let valueType = file.getAttribute("data-type");
    let valueCreated = file.getAttribute("data-created");
    let valueModified = file.getAttribute("data-modified");
    let valueLastOpened = file.getAttribute("data-lastOpened");
    let valueId = file.getAttribute("data-id");
    // changePreview(file.dataset.fileName, "/", file.dataset.owner, file.dataset.size, file.dataset.type, file.dataset.created, file.dataset.modified, file.dataset.lastOpened, 1);
    changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 0, 1);
    }
    else {
      active.splice(tpos, 1);
      // if(active.length == 0) {
      if(tpos == 0) {
        changePreview("title", "/", "id", "owner", "size", "type", "created", "modified", "lastOpened", 1, 0);
      }
      else {
        let temp = active[active.length-1];
        let valueTitle = temp.getAttribute("data-title");
        let valueOwner = temp.getAttribute("data-owner");
        let valueSize = temp.getAttribute("data-size");
        let valueType = temp.getAttribute("data-type");
        let valueCreated = temp.getAttribute("data-created");
        let valueModified = temp.getAttribute("data-modified");
        let valueLastOpened = temp.getAttribute("data-lastOpened");
        let valueId = temp.getAttribute("data-id");
        // changePreview(folder.dataset.title, "/", folder.dataset.owner, folder.dataset.size, folder.dataset.type, folder.dataset.created, folder.dataset.modified, folder.dataset.lastOpened, 1);
        changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 0, 1)
      }
    }
    // console.log(active.length, folders.length, files.length);
    //! add this functionality or not? needed????
    // if(active.length === (folders.length + files.length)) {
    //   selectAllBtn.checked = true;
    // }
    // else {
    //   selectAllBtn.checked = false;
    // }
    file.classList.toggle("active");
    //remove other actives coz it allows selection of multiple items which should only work with ctrl + click
    if(!e.ctrlKey && !e.metaKey) {
      files.forEach( tempFile => {
        if(tempFile !== file) {
          tempFile.classList.remove("active");
          const pos = active.indexOf(tempFile);
          if(pos !== -1) {
            active.splice(pos, 1);
            }

        }
      });
      folders.forEach( tempFolder => {
          tempFolder.classList.remove("active");
          const pos = active.indexOf(tempFolder);
          if(pos !== -1) {
            active.splice(pos, 1);
            }

      });
    }
    // console.log(active);
    if(active.length === (folders.length + files.length)) {
      selectAllBtn.checked = true;
    }
    else {
      selectAllBtn.checked = false;
    }
  })
});

//* deselect all on clicking (left button) the  directory area (right mouse button handled in modal opening on right click part)
const fileDirectory = document.querySelector(".file-directory");
// const selectAllBtn = document.querySelector("#select-all-files");

fileDirectory.addEventListener("click", function(e) {
  if(!e.ctrlKey && !e.metaKey) {
    active = [];
    changePreview("title", "/", "id", "owner", "size", "type","created", "modified", "lastOpened", 1, 0);
    folders.forEach( tempFolder => {
      tempFolder.classList.remove("active");
    });
    files.forEach( tempFile => {
      tempFile.classList.remove("active");
    });
    selectAllBtn.checked = false;
  }
})




//* open right click modal active folder
// contextmenu on file/folder
// set the file/folder as active as well
// deselect all since we are not adding support for multiple selection context menu

//folders
folders.forEach( folder => {
  folder.addEventListener("contextmenu", function(e) {
    active.push(folder);
    // changePreview(folder.dataset.folderName, "/", folder.dataset.owner, folder.dataset.size, folder.dataset.type, folder.dataset.created, folder.dataset.modified, folder.dataset.lastOpened, 1);
    let valueTitle = folder.getAttribute("data-title");
    let valueOwner = folder.getAttribute("data-owner");
    let valueSize = folder.getAttribute("data-size");
    let valueType = folder.getAttribute("data-type");
    let valueCreated = folder.getAttribute("data-created");
    let valueModified = folder.getAttribute("data-modified");
    let valueLastOpened = folder.getAttribute("data-lastOpened");
    let valueId = folder.getAttribute("data-id");
    changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 1, 1);
    folder.classList.add("active"); //! check if this adds duplicate or not
    folders.forEach( tempFolder => {
      if(tempFolder != folder) {
        tempFolder.classList.remove("active");
        const pos = active.indexOf(tempFolder);
        if(pos !== -1) {
          active.splice(pos, 1);
          }
      }
    });
    files.forEach( tempFile => {
      tempFile.classList.remove("active");
      const pos = active.indexOf(tempFile);
      if(pos !== -1) {
        active.splice(pos, 1);
        }

  });
    let itemModal = folder.querySelector(".item-modal");
    let itemPopup = folder.querySelector(".item-popup");
    itemModal.style.display = "block";
    itemPopup.style.display = "flex";
  })
})
files.forEach( file => {
  file.addEventListener("contextmenu", function(e) {
    active.push(file);
    // changePreview(file.dataset.fileName, "/", file.dataset.owner, file.dataset.size, file.dataset.type, file.dataset.created, file.dataset.modified, file.dataset.lastOpened, 1);
    let valueTitle = file.getAttribute("data-title");
    let valueOwner = file.getAttribute("data-owner");
    let valueSize = file.getAttribute("data-size");
    let valueType = file.getAttribute("data-type");
    let valueCreated = file.getAttribute("data-created");
    let valueModified = file.getAttribute("data-modified");
    let valueLastOpened = file.getAttribute("data-lastOpened");
    let valueId = file.getAttribute("data-id");
    changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 0, 1);
    file.classList.add("active"); //! check if this adds duplicate or not
    files.forEach( tempFile => {
      if(tempFile != file) {
        tempFile.classList.remove("active");
        const pos = active.indexOf(tempFile);
        if(pos !== -1) {
          active.splice(pos, 1);
          }
      }
    });
    folders.forEach( tempFolder => {
          tempFolder.classList.remove("active");
          const pos = active.indexOf(tempFolder);
          if(pos !== -1) {
            active.splice(pos, 1);
            }
    
      });

    let itemModal = file.querySelector(".item-modal");
    let itemPopup = file.querySelector(".item-popup");
    itemModal.style.display = "block";
    itemPopup.style.display = "flex";
  })
})

const itemModals = document.querySelectorAll(".item-modal");
itemModals.forEach(itemModal => {
  itemModal.addEventListener("click", function(e) {
    // console.log("something");
    e.stopPropagation();
    e.currentTarget.style.display = "none";
    let itemPopup = e.currentTarget.nextElementSibling;
    itemPopup.style.display = "none";
    let item = e.currentTarget.parentElement;
    item.classList.remove("active");
    //! also remove preview values as clicking elsewhere just deselects everythinh
    active = [];
    changePreview("title", "/", "id", "owner", "size", "type", "created", "modified", "lastOpened", 1, 0);
    
  })
})

//close item-popup on clicking copy / move / download / delete / details / star
const updateDirectoryFolderModal = document.querySelector(".update-directory-folder-modal");
const itemActionBtns = document.querySelectorAll(".item-action-btn");
itemActionBtns.forEach(itemActionBtn => {
  itemActionBtn.addEventListener("click", function(e) {
    let itemPopup = itemActionBtn.parentElement
    itemPopup.style.display = "none"; //itemPopup
    itemPopup.previousElementSibling.style.display = "none"; //itemModal
    if(e.currentTarget.classList.contains("rename-folder-btn")) {
      updateDirectoryFolderModal.style.display = "block";
    }
  })
})



//* select all input btn to select all files and folder in dir
// const selectAllBtn = document.querySelector("#select-all-files");
selectAllBtn.addEventListener("change", function(e) {
  if(selectAllBtn.checked) {
    active = [];
    let last;
    folders.forEach(folder => {
      active.push(folder);
      folder.classList.add("active");
      last = folder;
    })
    files.forEach(file => {
      active.push(file);
      file.classList.add("active");
      last = file;
    })
    let valueTitle = last.getAttribute("data-title");
    let valueOwner = last.getAttribute("data-owner");
    let valueSize = last.getAttribute("data-size");
    let valueType = last.getAttribute("data-type");
    let valueCreated = last.getAttribute("data-created");
    let valueModified = last.getAttribute("data-modified");
    let valueLastOpened = last.getAttribute("data-lastOpened");
    let valueId = last.getAttribute("data-id");
    let folderFlag = 0;
    if(!valueType) {
      folderFlag = 1;
    }

    changePreview(valueTitle, "/", valueId, valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, folderFlag, 1);
  }
  else {
    active = [];
    folders.forEach(folder => {
      folder.classList.remove("active");
    })
    files.forEach(file => {
      file.classList.remove("active");
    })
    changePreview("title", "/", "id", "owner", "size", "type","created", "modified", "lastOpened", 1, 0);
  }
})


//* open right click modal file directory area
const rightClickModal = document.querySelector(".right-click-modal");
const rightClickOptions = document.querySelector(".right-click-options");
fileDirectory.addEventListener("contextmenu", function(e) {
  // console.log("success");
  console.log(e.target);
  if(e.target.classList.contains("file-directory")) {
    rightClickModal.style.display = "block";
    rightClickOptions.style.top = e.clientY + "px";
    rightClickOptions.style.left = e.clientX + "px";
    // console.log(e.clientX, e.clientY);
    // console.log(rightClickOptions);

  }
})
// added to window click with specific by searching for classlist contains. Instead of down below.
// rightClickModal.addEventListener("click", function(e) {
//   rightClickModal.style.display = "none";
// })
const rightClickAddOptions = document.querySelectorAll(".right-click-add-options");
rightClickAddOptions.forEach(option => {
  option.addEventListener("click", function(e) {
    rightClickModal.style.display = "none";
  })
});

const newFolderBtn2 = document.querySelector(".new-folder-btn2");


newFolderBtn2.addEventListener("click", function () {
  addDirectoryFolderModal.style.display = "block";
  addDirectoryModal.style.display = "none";
  // rightClickModal.style.display = "none";
});
newFolderModalClose.forEach((closeModalElement) => {
  closeModalElement.addEventListener("click", function () {
    addDirectoryFolderModal.style.display = "none";
  });
});


//* drag and select files and folders
// not implementing since multiple selection routes not handled



//* double click open
folders.forEach(folder => {
  folder.addEventListener("dblclick", function(e) {
    folder.querySelector(".item-action-btn").click();  //select the first item action btn from the dright click options
  })
})
files.forEach(file => {
  file.addEventListener("dblclick", function(e) {
    file.querySelector(".item-action-btn").click();  //select the first item action btn from the dright click options
  })
})

