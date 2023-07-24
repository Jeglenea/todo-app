export default {
  data() {
    return {
      en: {
        col1:"Category",
        col2:"Task",
        col3:"Status",
        col4:"Importance",
        col5:"Photo",
        loadingMessage: "Loading...",
        addTaskHeading: "Add your task to remember",
        enterTaskPlaceholder: "Enter task",
        addPhotoBtn: "Add Photo",
        submitBtn: "SUBMIT",
        category: ["Work", "Personal", "Shopping", "Study", "Other"],
        statusOptions: ["To-do", "In-progress", "Finished"],
        importanceOptions: ["Low", "Medium", "High"],
        editTaskBtn: "Edit Task",
        finishEditBtn: "Finish Edit",
        deleteTaskBtn: "Delete Task",
        editNotAllowedMsg: "Editing is not allowed for tasks with 'Finished' status.",
      },
    };
  },
};
