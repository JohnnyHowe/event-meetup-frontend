<template>
  <div v-bind:id="style">
    <h2 id="title">{{ title }}</h2>
    <slot/>
  </div>
</template>
<script>
/**
 * Wrapper for div.
 * Put page content in here and it will automatically move it according to stylesheet.
 *  
 * How to:
 *  Put all page content inside PageContent tags.
 * 
 * Props: 
 *  title: title of page to show at top of page
 *  type: the type of page to format to:
 *      options: default, form
 */
export default {
  props: {
    title: String,
    type: String,
  },
  computed: {
      style() {
          switch(this.type) {
              case "form-wide":
                  return "content-card-form-wide";
              case "form":
                  return "content-card-form";
                default:
                    return "content-card-main";
          }
      }
  }
};
</script>
<style scoped>
#content-card-main {
  width: 80%;
  margin: auto;
  margin-top: 24px;
  padding: 10px;
  padding-bottom: 0px;
}
#content-card-form {
  width: 50%;
  margin: auto;
  margin-top: 24px;
  padding: 10px;
  padding-bottom: 0px;
}
#content-card-form-wide {
  width: 65%;
  margin: auto;
  margin-top: 24px;
  padding: 10px;
  padding-bottom: 0px;
}
#title {
  text-align: center;
}
</style>
