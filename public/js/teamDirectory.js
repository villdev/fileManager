

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
  // if (teamModal.indexOf(e.target) !== -1) {
  //   e.target.style.display = "none";
  // }
});

//*------------- details icon -> open and close [plus add btn style handle] file + team --------------
const detailsBtn = document.querySelector(".details-btn");
const filesArea = document.querySelector(".files-area");
const previewPane = document.querySelector(".preview-pane");
const closePreview = document.querySelector(".close-preview");
const newBtn = document.querySelector(".new-btn");
const newBtnText = document.querySelector(".new-btn span");
let openDetailsFlag = false;

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
});
newFolderModalClose.forEach((closeModalElement) => {
  closeModalElement.addEventListener("click", function (e) {
    addDirectoryFolderModal.style.display = "none";
    // let currentUpdateDirectoryFolderModal = e.currentTarget.parentElement.parentElement.parentElement
    // if(updateDirectoryFolderModal.indexOf(currentUpdateDirectoryFolderModal) !== -1) {

    //   currentUpdateDirectoryFolderModal.style.display = "none";
    // }
    // else {
    //   currentUpdateDirectoryFolderModal = currentUpdateDirectoryFolderModal.parentElement; 
    //   currentUpdateDirectoryFolderModal.style.display = "none";
    // }
    // updateDirectoryFolderModal.style.display = "none";
  });
});




// //* active team on selection
let activeTeam = [];


// //* change values of details pane based on active variable

const previewSelectedTitle = document.querySelector(".selected-title");
const previewMain = document.querySelector(".preview-main");
const previewInfo = document.querySelector(".preview-info");
const dirActionBtns = document.querySelectorAll(".dir-action-btn");

function changePreviewTeam(title, id, manager, count, created, modified, flag) {
  if(flag == 0) {               //!close the preview
    //change div selected title to File Directory
    previewSelectedTitle.innerHTML =  "<img src=\"./icons/group-24px.svg\" /> Teams Directory";
    //add display-none class to preview-main and preview-info
    previewMain.classList.add("display-none");
    previewInfo.classList.add("display-none");
     //remove dir action btn links
     dirActionBtns[0].href = "#"; //copy
     //and remove them from display
     dirActionBtns[0].style.display = "none"; //copy
  }
  else {                        //!open the preview and update
    dirActionBtns[0].style.display = "flex"; //copy
    dirActionBtns[0].href = `/teams/delete/${id}`;
    //change div selected title to dataset value
    previewSelectedTitle.innerHTML =  `<img src=\"./icons/group-24px.svg\" /> ${title}`;
    //remove display none from preview-main
    previewMain.classList.remove("display-none");
    //!!!!!!!------------add preview of members to preview-main -> preview--------------------------
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
    let previewInfosValue = document.querySelectorAll(".preview-infos-value");
    previewInfosValue[0].innerHTML = manager;
    previewInfosValue[1].innerHTML = count;
    previewInfosValue[2].innerHTML = created[0];
    previewInfosValue[3].innerHTML = modified[0];
  }
}






// //* select left click event (single click select team + added support for ctrl multiple select)
const teams = document.querySelectorAll(".team");
const selectAllBtn = document.querySelector("#select-all-files");

teams.forEach(team => {
  team.addEventListener("click", function(e) {
    e.stopPropagation();
    
    let tpos = activeTeam.indexOf(team);
    if(tpos === -1) {
    activeTeam.push(team);
    let valueTitle = team.getAttribute("data-title");
    let valueManager = team.getAttribute("data-manager");
    let valueCount = team.getAttribute("data-count");
    let valueCreated = team.getAttribute("data-created");
    let valueModified = team.getAttribute("data-modified");
    let valueId = team.getAttribute("data-id");
    changePreviewTeam(valueTitle, valueId, valueManager, valueCount, valueCreated, valueModified, 1);
    }
    else {
      activeTeam.splice(tpos, 1);
      if(activeTeam.length == 0) {
      changePreviewTeam("title", "id", "manager","count","created","modified", 0);
      }
    }
    team.classList.toggle("active");
    
    //remove other actives coz it allows selection of multiple items which should only work with ctrl + click
    if(!e.ctrlKey && !e.metaKey) {
      teams.forEach( tempTeam => {
        // console.log(tempFolder === folder);
        if(tempTeam !== team) {
          tempTeam.classList.remove("active");
          const pos = activeTeam.indexOf(tempTeam);
          if(pos !== -1) {
          activeTeam.splice(pos, 1);
          }
        }
      }); 
    }
    if(activeTeam.length === teams.length) {
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
    activeTeam = [];
    changePreviewTeam("title", "id", "manager", "count","created", "modified", 0);
    teams.forEach( tempTeam => {
      tempTeam.classList.remove("active");
    });
    selectAllBtn.checked = false;
  }
})




// //* open right click modal active folder
// contextmenu on file/folder
// set the file/folder as active as well
// deselect all since we are not adding support for multiple selection context menu

//folders
teams.forEach( team => {
  team.addEventListener("contextmenu", function(e) {
    activeTeam.push(team);
    // let valueTitle = folder.getAttribute("data-title");
    // let valueOwner = folder.getAttribute("data-owner");
    // let valueSize = folder.getAttribute("data-size");
    // let valueType = folder.getAttribute("data-type");
    // let valueCreated = folder.getAttribute("data-created");
    // let valueModified = folder.getAttribute("data-modified");
    // let valueLastOpened = folder.getAttribute("data-lastOpened");
    // changePreview(valueTitle, "/", valueOwner, valueSize, valueType, valueCreated, valueModified, valueLastOpened, 1);
    let valueTitle = team.getAttribute("data-title");
    let valueManager = team.getAttribute("data-manager");
    let valueCount = team.getAttribute("data-count");
    let valueCreated = team.getAttribute("data-created");
    let valueModified = team.getAttribute("data-modified");
    let valueId = team.getAttribute("data-id");
    changePreviewTeam(valueTitle, valueId, valueManager, valueCount, valueCreated, valueModified, 1);
    team.classList.add("active"); //! check if this adds duplicate or not
    teams.forEach( tempTeam => {
      if(tempTeam != team) {
        tempTeam.classList.remove("active");
        const pos = activeTeam.indexOf(tempTeam);
        if(pos !== -1) {
          activeTeam.splice(pos, 1);
          }
      }
    });
    
    let itemModal = team.querySelector(".item-modal");
    let itemPopup = team.querySelector(".item-popup");
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
    changePreviewTeam("title", "id", "manager", "count","created", "modified", 0);
  })
})

//* select all input btn to select all files and folder in dir
// const selectAllBtn = document.querySelector("#select-all-files");
selectAllBtn.addEventListener("change", function(e) {
  if(selectAllBtn.checked) {
    activeTeam = [];
    let last;
    teams.forEach(team => {
      activeTeam.push(team);
      team.classList.add("active");
      last = team;
    })
    let valueTitle = last.getAttribute("data-title");
    let valueManager = last.getAttribute("data-manager");
    let valueCount = last.getAttribute("data-count");
    let valueCreated = last.getAttribute("data-created");
    let valueModified = last.getAttribute("data-modified");
    let valueId = last.getAttribute("data-id");
    changePreviewTeam(valueTitle, valueId, valueManager, valueCount, valueCreated, valueModified, 1);
  }
  else {
    activeTeam = [];
    teams.forEach(team => {
      team.classList.remove("active");
    })
    changePreviewTeam("title", "id", "manager", "count","created", "modified", 0);
  }
})


// //* open right click modal file directory area
// // contextmeny on fileDirectory area
// // not implementing coz of time constraint
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




//close item-popup on clicking copy / move / download / delete / details / star


const itemActionBtns = document.querySelectorAll(".item-action-btn");
itemActionBtns.forEach(itemActionBtn => {
  itemActionBtn.addEventListener("click", function(e) {
    let itemPopup = itemActionBtn.parentElement
    itemPopup.style.display = "none"; //itemPopup
    itemPopup.previousElementSibling.style.display = "none"; //itemModal
    if(e.currentTarget.classList.contains("rename-folder-btn")) {
      // updateDirectoryFolderModal.style.display = "block";
      let itemPopup = e.currentTarget.parentElement;
      let teamDiv = itemPopup.parentElement;
      let currentUpdateDirectoryFolderModal = teamDiv.nextElementSibling;
      currentUpdateDirectoryFolderModal.style.display = "block";

    }
    if(e.currentTarget.classList.contains("edit-members-btn")) {
      // teamModal.style.display = "block";
      let itemPopup = e.currentTarget.parentElement;
      let teamDiv = itemPopup.parentElement;
      let currentUpdateDirectooryFolderModel = teamDiv.nextElementSibling;
      let currentTeamModal = currentUpdateDirectooryFolderModel.nextElementSibling;
      currentTeamModal.style.display = "block";

    }
  })
})


const teamModal = document.querySelectorAll(".team-modal");
// const teamModalClose = document.querySelectorAll(".team-modal-close");

teamModal.forEach(modal => {
  let teamModalClose = modal.querySelector(".team-modal-close");
  teamModalClose.addEventListener("click", function (e) {
    // teamModal.style.display = "none";
    let curentTeamModal = e.currentTarget.parentElement.parentElement.parentElement;
    curentTeamModal.style.display = "none";
  });
  modal.addEventListener("click", function(e) {
    // e.currentTarget.style.display = "none";
    if(e.target === modal) {
      e.currentTarget.style.display = "none";

    }
  })
});

const updateDirectoryFolderModal = document.querySelectorAll(".update-directory-folder-modal");

updateDirectoryFolderModal.forEach(modal => {
  let folderModalClose = modal.querySelectorAll(".folder-modal-close");
  folderModalClose.forEach(closeModal => {
    closeModal.addEventListener("click", function(e) {
      modal.style.display = "none";
    })
  })
})



//!!!!!!!!!!!!!! add or remove button or manager button dont check for access on frontend !!!!!!  backend fine!!!!!!!!!
//!!!!!!! on reload it changes back to correct version.|||||||||||||||||||||||||||||||||||
const addToTeamBtn = document.querySelectorAll(".edit-team-member-add-btn");

addToTeamBtn.forEach(addBtn => {
  addBtn.addEventListener("click", handleAddBtn);
})

function handleAddBtn(e) {
    let teamid = e.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("data-teamid");
    let userid = e.currentTarget.parentElement.getAttribute("data-userid");
    let user = e.currentTarget.parentElement;
    let remove = user.parentElement.previousElementSibling;
    const teamMainDiv = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling;
    let count = teamMainDiv.getAttribute("data-count");
    // console.log(remove);
    // let removeUser = user;
    // console.log(teamid, userid);
    fetch(`teams/add/${teamid}/${userid}`, {method: "GET"})
    .then(function(response) {
      if(response.ok) {
        //!--------------------------- add this user to remove div from add
        // e.currentTarget.parentElement.remove();

        return;
      }
      throw new Error("couldnt add");
    })
    .catch(function(error) {
      console.log(error);
    });
    // let link = document.createElement("a");
    // link.href = `/teams/add/${teamid}/${userid}`;
    // link.click();
    user.remove();
    let teamTitle = user.querySelector(".admin-manager-team");
    teamTitle.innerText = "Member";
    let teamAddBtn = user.querySelector(".edit-team-member-add-btn");
    teamAddBtn.remove();
    const managerBtn = document.createElement("button");
    managerBtn.innerText = "Manager";
    managerBtn.classList.add("edit-team-manager-btn");
    //! add event listener
    managerBtn.addEventListener("click", handleManagerBtn);
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.classList.add("edit-team-member-remove-btn");
    //! add event listenor
    removeBtn.addEventListener("click", handleRemoveBtn);
    user.appendChild(managerBtn);
    user.appendChild(removeBtn);
    remove.appendChild(user);

    //change count data attribute in team as it needs to be refreshed before it chagnes value now
    count = Number(count) + 1;
    // console.log(count);
  teamMainDiv.setAttribute("data-count", count)
}





const removeFromTeamBtn = document.querySelectorAll(".edit-team-member-remove-btn");

removeFromTeamBtn.forEach(remBtn => {
  remBtn.addEventListener("click", handleRemoveBtn);
});

function handleRemoveBtn(e) {
  let teamid = e.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("data-teamid");
  let userid = e.currentTarget.parentElement.getAttribute("data-userid");
  let user = e.currentTarget.parentElement;
  let add = user.parentElement.nextElementSibling;
  const teamMainDiv = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.previousElementSibling;
  let count = teamMainDiv.getAttribute("data-count");
  // console.log(remove);
  // let removeUser = user;
  // console.log(teamid, userid);
  fetch(`teams/remove/${teamid}/${userid}`, {method: "GET"})
  .then(function(response) {
    if(response.ok) {
      //!--------------------------- add this user to remove div from add
      // e.currentTarget.parentElement.remove();

      return;
    }
    throw new Error("couldnt add");
  })
  .catch(function(error) {
    console.log(error);
  });
  // let link = document.createElement("a");
  // link.href = `/teams/add/${teamid}/${userid}`;
  // link.click();
  user.remove();
  let teamTitle = user.querySelector(".admin-manager-team");
  teamTitle.innerText = "";
  let teamRemoveBtn = user.querySelector(".edit-team-member-remove-btn");
  teamRemoveBtn.remove();
  let teamManagerBtn = user.querySelector(".edit-team-manager-btn");
  teamManagerBtn.remove();
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  addBtn.classList.add("edit-team-member-add-btn");
  addBtn.addEventListener("click", handleAddBtn);
  user.appendChild(addBtn);
  add.appendChild(user);
  
  // console.log(teamMainDiv);
  count = Number(count) - 1;
  // console.log(count);
  teamMainDiv.setAttribute("data-count", count)
}



const managerTeamBtn = document.querySelectorAll(".edit-team-manager-btn");

managerTeamBtn.forEach(managerBtn => {
  managerBtn.addEventListener("click", handleManagerBtn);
});

function handleManagerBtn(e) {
  let teamid = e.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute("data-teamid");
  let userid = e.currentTarget.parentElement.getAttribute("data-userid");
  let user = e.currentTarget.parentElement;
  // let add = user.parentElement.nextElementSibling;
  // console.log(remove);
  // let removeUser = user;
  // console.log(teamid, userid);
  fetch(`teams/manager/${teamid}/${userid}`, {method: "GET"})
  .then(function(response) {
    if(response.ok) {
      //!--------------------------- add this user to remove div from add
      // e.currentTarget.parentElement.remove();

      return;
    }
    throw new Error("couldnt add");
  })
  .catch(function(error) {
    console.log(error);
  });
  // let link = document.createElement("a");
  // link.href = `/teams/add/${teamid}/${userid}`;
  // link.click();
  // user.remove();
  let teamTitle = user.querySelector(".admin-manager-team");
  teamTitle.innerText = "Manager";
  let teamRemoveBtn = user.querySelector(".edit-team-member-remove-btn");
  teamRemoveBtn.remove();
  let teamManagerBtn = user.querySelector(".edit-team-manager-btn");
  teamManagerBtn.remove();
  
  const teamMembersDiv = user.parentElement;
  const teamMembers = teamMembersDiv.querySelectorAll(".edit-team-user");
  teamMembers.forEach(member => {
    let teamTitle = member.querySelector(".admin-manager-team");
    if(teamTitle.innerText == "Manager" && member != user) {
      teamTitle.innerText = "Member";
      const managerBtn = document.createElement("button");
      managerBtn.innerText = "Manager";
      managerBtn.classList.add("edit-team-manager-btn");
      managerBtn.addEventListener("click", handleManagerBtn);
      const removeBtn = document.createElement("button");
      removeBtn.innerText = "Remove";
      removeBtn.classList.add("edit-team-member-remove-btn");
      removeBtn.addEventListener("click", handleRemoveBtn);
      member.appendChild(managerBtn);
      member.appendChild(removeBtn);
    }
  })

}

const userSearchBtns = document.querySelectorAll(".edit-team-search-btn");


userSearchBtns.forEach(searchBtn => {
  searchBtn.addEventListener("click", function(e) {

    const inputSearch = e.currentTarget.previousElementSibling;
    let searchTerm = inputSearch.value.toLowerCase();
    const membersDiv = e.currentTarget.parentElement.nextElementSibling;
    const membersDivInnerHtml = membersDiv.innerHTML;
    const members = membersDiv.querySelectorAll(".edit-team-user");
    let membersName = [];
    members.forEach(member => {
      membersName.push(member.getAttribute("data-username"));
    });
    //search
    let filteredMembers = membersName.filter((x) => {
      // let name = x.getAttribute("data-username").toLowerCase();
      // return name.includes(searchTerm);
      //!-------------add regex search ---------------------------------||||||||||||||||||||
      return x.toLowerCase().includes(searchTerm);
    });
    members.forEach(member => {
      let name = member.getAttribute("data-username");
      if(filteredMembers.indexOf(name) === -1) {
        member.style.display = "none";
      }
      else {
        member.style.display = "flex";
      }
    });
    if(searchTerm == "") {
      members.forEach(member => {
        member.style.display = "flex";
      })
    }
  })
});

const userSearchInputs = document.querySelectorAll(".edit-team-search-input");
userSearchInputs.forEach(input => {
  input.addEventListener("keyup", function(e) {
    if(e.code === "Enter") {
      const searchBtn = e.currentTarget.nextElementSibling;
      searchBtn.click();
    }
  });
  input.addEventListener("change", function(e) {
    if(input.value == "") {
      const membersDiv = e.currentTarget.parentElement.nextElementSibling;
      const members = membersDiv.querySelectorAll(".edit-team-user");
      members.forEach(member => {
        member.style.display = "flex";
      })
    }
    else {
      const searchBtn = e.currentTarget.nextElementSibling;
      searchBtn.click();
    }
  });
  input.addEventListener("input", function(e) {
    if(input.value == "") {
      const membersDiv = e.currentTarget.parentElement.nextElementSibling;
      const members = membersDiv.querySelectorAll(".edit-team-user");
      members.forEach(member => {
        member.style.display = "flex";
      })
    }
    else {
      const searchBtn = e.currentTarget.nextElementSibling;
      searchBtn.click();
    }
  });
  input.addEventListener("textInput", function(e) {
    if(input.value == "") {
      const membersDiv = e.currentTarget.parentElement.nextElementSibling;
      const members = membersDiv.querySelectorAll(".edit-team-user");
      members.forEach(member => {
        member.style.display = "flex";
      })
    }
    else {
      const searchBtn = e.currentTarget.nextElementSibling;
      searchBtn.click();
    }
  });
  
});
//!remove extra addeventlisteners from above searchteam input




// const checkName = (name,str) => {
//   let pattern = str.split("").map((x) => {
//     return `(?=.*$(x))`
//   }).join("");
//   let regex = new RegExp(`${pattern}`, "g");
  
//   return name.match(regex);
// }
//! also add enter key event for inputSearch


//! on change of search input to empty show normal view.