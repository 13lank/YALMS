<template>
  <v-container>
    <h1>Logging out...</h1>
  </v-container>
</template>
<script>
export default {
  data: () => ({}),
  mounted() {
    this.$http.post("/api/common/login/logout").then(res => {
      alert("Logged out!");
      this.$router.replace({ path: "dashboard" });
      window.location.reload();
    });
  }
};
</script>

