<template>
  <div v-if="isLoading" class="text-center mt-5">
    <p>Loading...</p>
  </div>
  <div v-else class="container" style="max-width: 1000px">
    <!-- Heading -->
    <h2 class="text-center mt-5">Add your task to remember</h2>

    <!-- Input -->
    <div class="d-flex mt-5">
      <input
        type="text"
        v-model="task"
        placeholder="Enter task"
        class="w-100 form-control"
      />
      <button class="btn btn-warning rounded-0" @click="submitTask">
        SUBMIT
      </button>
    </div>

    <!-- Task table -->
    <table class="table table-bordered mt-5">
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Photo</th>
          <th scope="col" style="width: 150px">Status</th>
          <th scope="col" style="width: 150px">Importance</th>
          <th scope="col" class="text-center">#</th>
          <th scope="col" class="text-center">#</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            <span :class="{ 'line-through': task.status === 'Finished' }">
              {{ task.name }}
            </span>
          </td>
          <td>
            <p class="fa fa-upload pointer" @click="openFileInput"></p>
            <input
              type="file"
              @change="handleFileUpload"
              ref="fileInput"
              class="small-file-input"
            />
          </td>
          <td>
            <div
              v-if="editedTask !== index"
              @click="editStatus(index)"
              :class="{
                'text-danger': task.status === 'To-do',
                'text-warning': task.status === 'In-progress',
                'text-success': task.status === 'Finished',
              }"
            >
              {{ task.status }}
              <p class="fa fa-pen pointer"></p>
            </div>
            <div v-else>
              <select
                v-model="task.status"
                class="form-control"
                @change="updateStatus"
              >
                <option
                  v-for="status in statuses"
                  :value="status"
                  :key="status"
                  :class="{
                    'text-danger': status === 'To-do',
                    'text-warning': status === 'In-progress',
                    'text-success': status === 'Finished',
                  }"
                >
                  {{ status }}
                </option>
              </select>
            </div>
          </td>
          <td>
            <div
              v-if="editedTask !== index"
              @click="editImportance(index)"
              :class="{
                'text-danger': task.importance === 'High',
                'text-warning': task.importance === 'Medium',
                'text-success': task.importance === 'Low',
              }"
            >
              {{ task.importance }}
              <p class="fa fa-pen pointer"></p>
            </div>
            <div v-else>
              <select
                v-model="task.importance"
                class="form-control"
                @change="updateImportance"
              >
                <option
                  v-for="level in importanceLevels"
                  :value="level"
                  :key="level"
                  :class="{
                    'text-danger': level === 'High',
                    'text-warning': level === 'Medium',
                    'text-success': level === 'Low',
                  }"
                >
                  {{ level }}
                </option>
              </select>
            </div>
          </td>
          <td class="text-center">
            <div @click="deleteTask(index)">
              <span class="fa fa-trash pointer"></span>
            </div>
          </td>
          <td class="text-center">
            <div @click="editTask(index)">
              <p class="fa fa-pen pointer"></p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  data() {
    return {
      isLoading: true,
      task: "",
      editedTask: null,
      importanceLevels: ["Low", "Medium", "High"], // Importance levels
      statuses: ["To-do", "In-progress", "Finished"],

      /* Status could be: 'to-do' / 'in-progress' / 'finished' */
      tasks: [
        {
          name: "Steal bananas from the supermarket.",
          status: "To-do",
          importance: "Low", // Importance level for this task
        },
        {
          name: "Eat 1 kg chocolate in 1 hour.",
          status: "In-progress",
          importance: "Medium", // Importance level for this task
        },
        {
          name: "Create YouTube video.",
          status: "Finished",
          importance: "High", // Importance level for this task
        },
      ],
    };
  },

  created() {
    // Simulate a 2-second loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  },

  methods: {
    openFileInput(event) {
      this.selectedFile=event.target.files[0];
    },

    /**
     * Capitalize first character
     */
    capitalizeFirstChar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Edit importance
     */
    editStatus(index) {
      this.task = this.tasks[index].status;
      this.editedTask = index;
    },

    /**
     * Update importance after editing
     */
    updateStatus() {
      this.editedTask = null;
    },

    /**
     * Edit importance
     */
    editImportance(index) {
      this.task = this.tasks[index].importance;
      this.editedTask = index;
    },

    /**
     * Update importance after editing
     */
    updateImportance() {
      this.editedTask = null;
    },

    /**
     * Deletes task by index
     */
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },

    /**
     * Edit task
     */
    editTask(index) {
      if (this.tasks[index].status === "Finished") {
        // Show a pop-up alert to inform the user that editing is not allowed for "finished" tasks
        alert("Editing is not allowed for tasks with 'finished' status.");
        return;
      }
      this.task = this.tasks[index].name;
      this.editedTask = index;
    },

    /**
     * Add / Update task
     */
    submitTask() {
      if (this.task.length === 0) return;

      /* We need to update the task */
      if (this.editedTask !== null) {
        this.tasks[this.editedTask].name = this.task;
        this.editedTask = null;
      } else {
        /* We need to add a new task */
        const newTask = {
          name: this.task,
          status: "To-do",
          importance: "Low", // Default importance level for new tasks
          file: null, // Initialize file property for the new task
        };

        // Check if a file was attached to the new task and store it
        if (
          this.$refs.fileInput &&
          this.$refs.fileInput[0] &&
          this.$refs.fileInput[0].files[0]
        ) {
          newTask.file = this.$refs.fileInput[0].files[0];
        }

        this.tasks.push(newTask);
      }

      this.task = "";
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.line-through {
  text-decoration: line-through;
}
</style>