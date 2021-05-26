<template>
  <PageContent title="My Events">
    {{ userId }}
  </PageContent>
</template>
<script>
import PageContent from "@/components/other/PageContent.vue";
/**
 * Show all the events that the user with prop userId is related to.
 *  - Events they organize
 *  - Events they're attending (accepted)
 *  - Events they with to attend (pending)
 */
export default {
  components: { PageContent },
  props: ["userId"],
};
</script>