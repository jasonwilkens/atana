<template>
  <div>
    <h1>hello</h1>
    <button
      id="submit"
      v-on:click.prevent="handleCourseRequest"
      :disabled="isCourseFieldDisabled"
      type="submit"
    >
      USH
    </button>
    <p v-if="courseData">{{ courseData.title }}</p>
  </div>
</template>

<script>
export default {
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
            code: "USH",
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
        if (error.response && error.response.status === 404) {
          this.hasError = true;
          this.errorMessage = "Course not found";
          this.isCourseFieldDisabled = false;
          //this.$refs.password.focus();
        } else {
          //this.$store.dispatch('updateNotificationText', 'Authentication failed, something\'s wrong');
          this.isLoginDisabled = false;
        }
      }
    },
    handleCourseRequest: function () {
      this.getCourseData();
      /*
      if (this.enteredCourseCode === null || this.enteredCourseCode === "") {
        this.hasError = true;
        this.errorMessage = "Required";
        this.$refs.password.focus();
        return;
      } else {
        this.isCourseFieldDisabled = true;
        this.getCourseData();
      }
      */
    },
  },
};
</script>
