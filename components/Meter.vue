<template>
  <div class="meter-container">
    <div class="meter" ref="meter">
      <span
        class="meter-bar"
        :style="`width: ${value}%; ${valueInt === 100 ? 'border-end-end-radius: .125rem; border-start-end-radius: .125rem;' : ''}`"
      ></span>
      <span class="rest" :style="`width: ${100 - value}%`"></span>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    valueInt() {
      return parseInt(this.value);
    },
  },
  mounted() {
    let root = document.documentElement;
    if (this.quality >= 90) {
      root.style.setProperty("--meter-bar", "var(--green)");
      root.style.setProperty("--meter-bar-oncolor", "var(--foreground-color)");
    } else if (this.quality >= 80) {
      root.style.setProperty("--meter-bar", "var(--yellow)");
      root.style.setProperty("--meter-bar-oncolor", "var(--foreground-color)");
    } else if (this.quality >= 70) {
      root.style.setProperty("--meter-bar", "var(--orange)");
      root.style.setProperty("--meter-bar-oncolor", "var(--white)");
    } else {
      root.style.setProperty("--meter-bar", "var(--red)");
      root.style.setProperty("--meter-bar-oncolor", "var(--white)");
    }
  },
  props: ["value", "quality"],
};
</script>

<style>
.meter {
  width: 100%;
  max-width: 40rem;
  height: 0.5em;
  display: flex;
}

/* this is the inner element reflecting the value */
:root {
  --meter-bar: var(--gray);
  --meter-bar-oncolor: var(--foreground-color);
}

.meter-bar {
  background-color: var(--meter-bar);
  border-end-start-radius: 0.125rem;
  border-start-start-radius: 0.125rem;
  transition: background-color 500ms ease-in;
}

.rest {
  background: var(--gray);
  border-start-end-radius: 0.125rem;
  border-end-end-radius: 0.125rem;
}

.meter-container {
  flex: 1 1 auto;
}

@media screen and (min-width: 500px) {
  .meter-container {
    min-width: 20rem;
  }
}
</style>
