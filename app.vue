<template>
  <div class="layout">
    <div class="wrapper">
      <h1>Atana course lookup</h1>
      <form v-if="!courseData" class="course-form">
        <label for="courseField"> Course Code </label>
        <input
          :disabled="isCourseFieldDisabled"
          type="text"
          id="courseField"
          v-on:keyup.esc="handleUnfocus"
          v-on:keyup="handleCourseFieldChange"
          :value="enteredCourseCode"
          :aria-invalid="hasError"
          ref="courseField"
        />
        <button
          id="submit"
          v-on:click.prevent="handleCourseRequest"
          :disabled="isCourseFieldDisabled"
          type="submit"
        >
          Lookup
        </button>
        <p v-if="hasError" class="error">{{ errorMessage }}</p>
      </form>

      <div v-if="courseData" class="course-data">
        <button
          v-on:click="handleClearCourse"
          class="clear-course"
          aria-label="clear course data"
        >
          Course Code: {{ enteredCourseCode }} &times;
        </button>
        <p class="course-title">{{ courseData.title }}</p>
        <Meter
          :value="Math.floor(usagePercent)"
          :quality="courseData.averageMasteryScore"
        />
        <h2>Average mastery score</h2>
        <p>
          <span class="metric course-mastery"
            >{{ courseData.averageMasteryScore }}%</span
          >
        </p>
        <h2>Registrations used</h2>
        <p>
          <span class="metric usage">{{ usagePercent }}%</span>
          ({{ courseData.registrationCount.toLocaleString() }}/{{
            courseData.purchasedCount.toLocaleString()
          }})
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Meter from "~/components/Meter.vue";

export default {
  components: {
    Meter,
  },
  computed: {
    usagePercent() {
      return (
        (this.courseData.registrationCount * 100) /
        this.courseData.purchasedCount
      ).toFixed(1);
    },
  },
  data() {
    return {
      courseData: null,
      enteredCourseCode: null,
      errorMessage: null,
      hasError: false,
      hasSuccess: false,
      isCourseFieldDisabled: false,
    };
  },
  methods: {
    async getCourseData() {
      try {
        const response = await $fetch("/.netlify/functions/getCourseData", {
          method: "POST",
          body: {
            code: this.enteredCourseCode.trim(),
          },
          headers: {
            "X-Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response) {
          this.courseData = JSON.parse(response).courseData;
        }
      } catch (error) {
        this.hasError = true;
        this.isCourseFieldDisabled = false;
        this.$nextTick(() => this.$refs.courseField.focus());
        if (error.response && error.response.status === 404) {
          this.errorMessage = "Course not found";
        } else {
          this.errorMessage = "Something went wrong";
        }
      }
    },
    handleClearCourse: function () {
      this.enteredCourseCode = "";
      this.courseData = null;
      this.isCourseFieldDisabled = false;
      this.$nextTick(() => this.$refs.courseField.focus());
    },
    handleCourseRequest: function () {
      if (this.enteredCourseCode === null || this.enteredCourseCode === "") {
        this.hasError = true;
        this.errorMessage = "A valid course code is required";
        this.$refs.courseField.focus();
        return;
      } else {
        this.isCourseFieldDisabled = true;
        this.getCourseData();
      }
    },
    handleCourseFieldChange: function (e) {
      this.enteredCourseCode = e.target.value.toUpperCase();
      if (e.target.value !== "") {
        this.hasError = false;
      }
    },
  },
};
</script>

<style>
body {
  background-image: linear-gradient(180deg, white, var(--gray));
  margin: 0;
}

.layout {
  display: flex;
  height: 100dvh;
  align-items: center;
  justify-content: center;
}

.wrapper {
  background-color: var(--white);
  display: inline-block;
  margin: auto;
  border-radius: 0.25rem;
  padding: 1rem;
}

.course-form {
  display: flex;
  flex-direction: column;
}

.course-form input,
.course-form button[type="submit"] {
  display: block;
}

.course-form input + button {
  margin-block-start: 0.75rem;
}

.course-form p.error {
  margin-block: 1rem 0;
  color: var(--red);
}

.course-data .course-title {
  margin-block: 0.5rem 0;
}

.metric {
  background-color: var(--gray);
  border-radius: 0.25rem;
  padding: 0 0.5rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  transition:
    background-color 500ms ease-out,
    color 500ms ease-in;
}

.clear-course {
  margin-block: 0.5rem;
}

.course-mastery {
  background-color: var(--meter-bar);
  color: var(--meter-bar-oncolor);
}

.usage {
  background-color: var(--foreground-color);
  color: var(--on-color);
}

.course-data p {
  margin-block: 0 0.5rem;
}

.course-data p:last-child {
  margin-block-end: 0;
}
</style>
