<template>
  <div v-if="isLoading" class="text-center mt-5" style="color: #18f98c">
    <h3 style="font-size: 24px">Loading...</h3>
    <div
      class="spinner-border"
      role="status"
      style="width: 3rem; height: 3rem; color: #bbffde"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else class="container" style="max-width: 1000px">
    <!-- Heading -->
    <h2 class="text-center mt-5">{{ translate("addTaskHeading") }}</h2>

    <!-- Input -->
    <div class="d-flex mt-3">
      <select
        v-model="selectedCategory"
        class="form-control mx-1"
        style="width: 100px; background-color: #bbffde; color: #0eb665"
      >
        <option
          v-for="(category, index) in categories"
          :key="index"
          :value="category"
        >
          {{ translateCategory(category) }}
        </option>
      </select>
      <input
        type="text"
        v-model="taskName"
        :placeholder="translatedPlaceholder"
        class="w-100 form-control mx-1"
        style="background-color: #bbffde; color: #0eb665"
      />
      <input
        type="file"
        ref="photoInput"
        style="display: none"
        accept="image/*"
        @change="onPhotoSelected"
      />
      <button
        class="btn btn-primary mx-1"
        @click="selectPhoto"
        style="background-color: #0eb665; border-color: #0eb665"
      >
        {{ translate("addPhotoBtn") }}
      </button>
      <select
        v-model="selectedStatus"
        class="form-control mx-1"
        style="width: 113px; background-color: #bbffde; color: #0eb665"
      >
        <option
          v-for="(status, index) in statuses"
          :key="index"
          :value="status"
        >
          {{ translateStatus(status) }}
        </option>
      </select>
      <select
        v-model="selectedImportance"
        class="form-control mx-1"
        style="width: 100px; background-color: #bbffde; color: #0eb665"
      >
        <option
          v-for="(level, index) in importanceLevels"
          :key="index"
          :value="level"
        >
          {{ translateImportance(level) }}
        </option>
      </select>
      <!-- Finish Edit button (only shown when editing an existing task) -->
      <button
        v-if="editedTask !== null"
        class="btn btn-success mx-1"
        @click="finishEdit"
        style="background-color: #0eb665; border-color: #0eb665"
      >
        {{ translate("finishEditBtn") }}
      </button>

      <!-- Submit button (shown when not editing or after finishing edit) -->
      <button
        v-else
        class="btn btn-warning rounded-2 mx-1"
        @click="submitTask"
        style="background-color: #0eb665; border-color: #0eb665; color: white"
      >
        {{ translate("submitBtn") }}
      </button>
    </div>

    <!-- Task table -->
    <table class="table table-bordered mt-5" style="background-color: #bbffde">
      <thead>
        <tr>
          <th scope="col" style="background-color: #0eb665; color: white">
            {{ translate("col1") }}
          </th>
          <th scope="col" style="background-color: #0eb665; color: white">
            {{ translate("col2") }}
          </th>
          <th
            scope="col"
            style="background-color: #0eb665; color: white; width: 150px"
          >
            {{ translate("col3") }}
          </th>
          <th
            scope="col"
            style="background-color: #0eb665; color: white; width: 150px"
          >
            {{ translate("col4") }}
          </th>
          <th scope="col" style="background-color: #0eb665; color: white">
            {{ translate("col5") }}
          </th>
          <th
            scope="col"
            class="text-center"
            style="background-color: #0eb665; color: white"
          >
            #
          </th>
          <th
            scope="col"
            class="text-center"
            style="background-color: #0eb665; color: white"
          >
            #
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            {{ translateCategory(task.category) }}
          </td>
          <td>
            <span :class="{ 'line-through': task.status === 'Finished' }">
              {{ task.name }}
            </span>
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
              {{ translateStatus(task.status) }}
              <p class="fa fa-pen pointer"></p>
            </div>
            <div v-else>
              <select
                v-model="task.status"
                class="form-control"
                @change="updateStatus"
                style="background-color: #bbffde; color: #0eb665"
              >
                <option
                  v-for="(status, index) in translatedStatusOptions"
                  :value="statuses[index]"
                  :key="index"
                  :class="{
                    'text-danger': statuses[index] === 'To-do',
                    'text-warning': statuses[index] === 'In-progress',
                    'text-success': statuses[index] === 'Finished',
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
              {{ translateImportance(task.importance) }}
              <p class="fa fa-pen pointer"></p>
            </div>
            <div v-else>
              <select
                v-model="task.importance"
                class="form-control"
                @change="updateImportance"
                style="background-color: #bbffde; color: #0eb665"
              >
                <option
                  v-for="(level, index) in translatedImportanceOptions"
                  :value="importanceLevels[index]"
                  :key="index"
                  :class="{
                    'text-danger': importanceLevels[index] === 'High',
                    'text-warning': importanceLevels[index] === 'Medium',
                    'text-success': importanceLevels[index] === 'Low',
                  }"
                >
                  {{ level }}
                </option>
              </select>
            </div>
          </td>
          <td>
            <img
              v-if="task.photo"
              :src="task.photo"
              class="img-thumbnail"
              style="max-height: 100px"
            />
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
    <!-- Language Select -->
    <div class="d-flex justify-content-center mt-4">
      <label for="lang" class="mx-2">Language:</label>
      <select name="lang" v-model="lang" class="form-control" style="width: 200px; background-color: #bbffde; color: #0eb665">
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
      </select>
    </div>
  </div>
</template>

<script>
import en from "./en.js";
import tr from "./tr.js";
import banana from "/src/assets/banana.jpg";
import sadman from "/src/assets/hide-the-pain-harold-why-you-should-not-use-stock-photos-1024x683.jpg";
export default {
  mixins: [en, tr],
  computed: {
    translatedPlaceholder() {
      return this.translate("enterTaskPlaceholder");
    },
    translatedCategoryOptions() {
      return this.categories.map((category) =>
        this.translateCategory(category)
      );
    },
    translatedStatusOptions() {
      return this.statuses.map((status) => this.translateStatus(status));
    },
    translatedImportanceOptions() {
      return this.importanceLevels.map((level) =>
        this.translateImportance(level)
      );
    },
  },
  name: "HelloWorld",
  props: {
    msg: String,
  },

  data() {
    return {
      lang: "en",
      isLoading: true,
      taskName: "",
      selectedStatus: "To-do",
      selectedImportance: "Low",
      editedTask: null,
      selectedPhoto: null,
      importanceLevels: ["Low", "Medium", "High"],
      statuses: ["To-do", "In-progress", "Finished"],
      selectedCategory: "Work",
      categories: ["Work", "Personal", "Shopping", "Study", "Other"],

      // Status could be: 'To-do' / 'In-progress' / 'Finished'
      tasks: [
        {
          name: "Steal bananas from the supermarket.",
          status: "To-do",
          importance: "Low",
          category: "Personal",
          photo: banana,
        },
        {
          name: "Eat 1 kg chocolate in 1 hour.",
          status: "In-progress",
          importance: "Medium",
          category: "Other",
          photo: "",
        },
        {
          name: "Create YouTube video.",
          status: "Finished",
          importance: "High",
          category: "Work",
          photo: sadman,
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
    translate(prop) {
      return this[this.lang][prop];
    },
    translateCategory(category) {
      //'tr' for Turkish translations
      return this.lang === "tr"
        ? this.tr["categoryOptions" + (this.categories.indexOf(category) + 1)]
        : category;
    },
    translateStatus(status) {
      //'tr' for Turkish translations
      return this.lang === "tr"
        ? this.tr["statusOption" + (this.statuses.indexOf(status) + 1)]
        : status;
    },

    translateImportance(level) {
      // 'tr' for Turkish translations
      return this.lang === "tr"
        ? this.tr[
            "importanceOptions" + (this.importanceLevels.indexOf(level) + 1)
          ]
        : level;
    },

    addPhotoToTask() {
      if (this.selectedPhoto) {
        const file = this.selectedPhoto;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (this.editedTask !== null) {
            // Editing an existing task
            this.tasks[this.editedTask].photo = e.target.result;
          } else {
            // Adding a new task
            const newTask = {
              name: this.taskName,
              status: this.selectedStatus,
              importance: this.selectedImportance,
              category: this.selectedCategory,
              photo: e.target.result, // Save the selected photo in the new task
            };
            this.tasks.push(newTask);
          }
        };
        reader.readAsDataURL(file);
        this.selectedPhoto = null; // Reset the selected photo after processing
      }
    },
    onPhotoSelected(event) {
      this.selectedPhoto = event.target.files[0];
    },
    selectPhoto() {
      this.$refs.photoInput.click();
    },

    capitalizeFirstChar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    editStatus(index) {
      this.selectedStatus = this.tasks[index].status;
      this.editedTask = index;
    },

    updateStatus() {
      this.editedTask = null;
    },

    editImportance(index) {
      this.selectedImportance = this.tasks[index].importance;
      this.editedTask = index;
    },

    updateImportance() {
      this.editedTask = null;
    },

    deleteTask(index) {
      this.tasks.splice(index, 1);
    },

    finishEdit() {
      if (this.editedTask !== null) {
        // Preserve the existing photo data, if available
        const existingPhoto = this.tasks[this.editedTask].photo;

        // Update the edited task with the new values
        this.tasks[this.editedTask].name = this.taskName;
        this.tasks[this.editedTask].status = this.selectedStatus;
        this.tasks[this.editedTask].importance = this.selectedImportance;
        this.tasks[this.editedTask].category = this.selectedCategory;

        if (this.selectedPhoto) {
          // If a new photo is selected, update the photo data
          const reader = new FileReader();
          reader.onload = (e) => {
            this.tasks[this.editedTask].photo = e.target.result;

            // Reset the input fields and editedTask index
            this.taskName = "";
            this.selectedStatus = "To-do";
            this.selectedImportance = "Low";
            this.selectedCategory = "Work";
            this.selectedPhoto = null;
            this.editedTask = null;
          };
          reader.readAsDataURL(this.selectedPhoto);
        } else {
          // If there is nonew photo is selected, set the preserved photo data back to the task
          this.tasks[this.editedTask].photo = existingPhoto;

          // Reset the input fields and editedTask index
          this.taskName = "";
          this.selectedStatus = "To-do";
          this.selectedImportance = "Low";
          this.selectedCategory = "Work";
          this.selectedPhoto = null;
          this.editedTask = null;
        }
      }
    },

    editTask(index) {
      if (this.tasks[index].status === "Finished") {
        // Show a pop-up alert to inform the user that editing is not allowed for "finished" tasks
        alert("Editing is not allowed for tasks with 'Finished' status.");
        return;
      }

      this.taskName = this.tasks[index].name;
      this.selectedStatus = this.tasks[index].status;
      this.selectedImportance = this.tasks[index].importance;
      this.selectedCategory = this.tasks[index].category;
      this.selectedPhoto = null;

      this.editedTask = index; // Set the editedTask index to the current index
    },

    submitTask() {
      if (this.taskName.length === 0 || this.selectedCategory === "") return;

      if (this.editedTask !== null) {
        // Editing an already known task
        this.tasks[this.editedTask].name = this.taskName;
        this.tasks[this.editedTask].status = this.selectedStatus;
        this.tasks[this.editedTask].importance = this.selectedImportance;
        this.tasks[this.editedTask].category = this.selectedCategory;
        this.addPhotoToTask(); // Update the photo, if we can
        this.editedTask = null; // Resets editedTask index after updating the task
      } else {
        // Adding a new task
        const newTask = {
          name: this.taskName,
          status: this.selectedStatus,
          importance: this.selectedImportance,
          category: this.selectedCategory,
          photo: null, // Initializing the photo property to null for new tasks
        };

        if (this.selectedPhoto) {
          // If a photo is selected, read and add it to the new task
          const reader = new FileReader();
          reader.onload = (e) => {
            newTask.photo = e.target.result;
            this.tasks.push(newTask); // Add the new task to the tasks array
            this.taskName = "";
            this.selectedStatus = "To-do";
            this.selectedImportance = "Low";
            this.selectedCategory = "";
          };
          reader.readAsDataURL(this.selectedPhoto);
        } else {
          this.tasks.push(newTask); // Add the new task to the tasks array without a photo
          this.taskName = "";
          this.selectedStatus = "To-do";
          this.selectedImportance = "Low";
          this.selectedCategory = "";
        }
      }
    },
  },
};
</script>

<style scoped>
.spinner-border {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  vertical-align: text-bottom;
  border: 0.3em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border 0.75s linear infinite;
  animation: spinner-border 0.75s linear infinite;
}

@-webkit-keyframes spinner-border {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner-border {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
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
.img-thumbnail {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
}
</style>
