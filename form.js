
document.addEventListener('DOMContentLoaded', function(){
  onDocumentReady();

});
let data = [];

function onDocumentReady(){
  order();
  document.querySelector(".save").addEventListener('click',saveInfo);
  data = JSON.parse(localStorage.getItem("data")) || [];
  updateData();
  document.querySelector("#status-selector").addEventListener('change',  updateData);
  document.querySelector("#priority-selector").addEventListener('change',  updateData);
  document.querySelector("#search").addEventListener('input',  updateData);
  window.onclick = function(event) {
    if (!event.target.matches('.controls')) {
      var dropdowns = document.getElementsByClassName("option-wrapper");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

}
function updateData() {
  localStorage.setItem("data", JSON.stringify(data))
  data = JSON.parse(localStorage.getItem("data")) || [];

  let filteredData = data;

  const taskStatus = document.querySelector("#status-selector").value;
  if(taskStatus !== "none"){
    filteredData = filteredData.filter(elem => taskStatus === "done" ? elem.done : !elem.done);
  }

  const taskPriority = document.querySelector("#priority-selector").value;
  if(taskPriority !== "none"){
    filteredData = filteredData.filter(elem => taskPriority === elem.priority);
  }

  const searchValue = document.querySelector("#search").value;
  if(searchValue !== ""){
    filteredData = filteredData.filter(elem => elem.title.includes(searchValue) || elem.description.includes(searchValue));
  }

  const tasks = document.querySelector(".tasks");
  tasks.innerHTML = "";
  let currentTask;
  for(let i = 0; i < filteredData.length; i++){
    currentTask = document.createElement("div");
    currentTask.className = "task";
    if(filteredData[i].done) currentTask.classList.add("done");

    const title = document.createElement("div");
    title.className = "title";
    title.innerText = filteredData[i].title;
    const description = document.createElement("div");
    description.className = "description";
    description.innerText = filteredData[i].description;

    const bottom = document.createElement("div");
    bottom.className = "bottom";
    const priority = document.createElement("div");
    priority.className = "task-priority";
    priority.innerText = filteredData[i].priority;
    const controls = document.createElement("div");
    controls.className = "controls";
    controls.innerText = "...";
    controls.id = `control${i}`;
    controls.addEventListener('click', ()=>{
      showDropdown(i)
    });
    const optionWrapper = document.createElement("div");
    optionWrapper.className = "option-wrapper";

    let currentOption = document.createElement("div");
    currentOption.innerText = "done";
    currentOption.addEventListener('click',()=> {
      data[i].done = !filteredData[i].done;
      updateData();
    });
    optionWrapper.append(currentOption);

    currentOption = document.createElement("div");
    currentOption.innerText = "edit";
    currentOption.addEventListener('click',()=> {
      const editModal = document.querySelector("#edit-modal");
      const title = editModal.querySelector("#title2");
      const priority = editModal.querySelector("#priority2");
      const description = editModal.querySelector("#description2");
      const save = editModal.querySelector(".save");
      editModal.style.display = "flex";
      title.value = filteredData[i].title;
      description.value = filteredData[i].description;
      priority.value = filteredData[i].priority;
      save.addEventListener('click', ()=>{
        data[data.findIndex(elem => elem.id === filteredData[i].id)].title = title.value;
        data[data.findIndex(elem => elem.id === filteredData[i].id)].description = description.value;
        data[data.findIndex(elem => elem.id === filteredData[i].id)].priority = priority.value;
        updateData();
      });
      updateData();
    });
    optionWrapper.append(currentOption);

    currentOption = document.createElement("div");
    currentOption.innerText = "delete";
    currentOption.addEventListener('click',()=>{
      data.splice(data.findIndex(elem => elem.id === filteredData[i].id),1);
      updateData();
    });
    optionWrapper.append(currentOption);


    controls.append(optionWrapper);
    currentTask.append(title);
    currentTask.append(description);
    bottom.append(priority);
    bottom.append(controls);
    currentTask.append(bottom);
    tasks.append(currentTask);
  }
}
function showDropdown(i) {
  if(document.querySelector(`#control${i}`))
  document.querySelector(`#control${i}`).querySelector("div").classList.toggle("show");
}
function order(){
  const modal = document.querySelector("#create-modal");
  const create = document.querySelector(".create");
  const close = modal.querySelector(".close");
  const cancel = modal.querySelector(".cancel");

  // let saved = document.querySelector(".save");


  create.onclick = function() {
    modal.style.display = "flex";

  }
  close.onclick = function() {
    modal.style.display = "none";
  }
  cancel.onclick = function() {
    modal.style.display = "none";
  }
  const editModal = document.querySelector("#edit-modal");
  const editCancel = editModal.querySelector(".cancel");
  const editClose = editModal.querySelector(".close");
  const saveEdit = editModal.querySelector(".save");
  saveEdit.onclick = function () {
    editModal.style.display = "none";
  }

  editCancel.onclick = function () {
    editModal.style.display = "none";
  }

  editClose.onclick = function () {
    editModal.style.display = "none";
  }
}
const saveInfo = (e)=>{
  e.preventDefault();
  document.querySelector("#create-modal").style.display = "none";
  let info = {
    id : `f${(~~(Math.random()*1e8)).toString(16)}`,
    title : document.getElementById("title").value,
    description : document.getElementById("description").value,
    priority : document.getElementById("priority").value,
    done : false
  }
  data.push(info);
  document.querySelector("#form").reset();
  updateData();
}
