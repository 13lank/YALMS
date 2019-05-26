<template>
  <v-container fill-height grid-list-xl>
    <v-layout justify-center column>
      <v-flex xs4>
        <material-card color="orange" title="Login As User">
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md12>
                  <v-text-field v-model="userdata.CardId" label="CardId"/>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field v-model="userdata.Password" type="password" label="Password"/>
                </v-flex>
                <v-flex xs12 text-xs-center>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="success"
                    @click="userlogin(userdata)"
                  >User Login</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
      <v-flex xs4>
        <material-card color="blue" title="Login As Admin">
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md12>
                  <v-text-field v-model="admindata.AdminName" label="AdminName"/>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field v-model="admindata.Password" type="password" label="Password"/>
                </v-flex>
                <v-flex xs12 text-xs-center>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="error"
                    @click="adminlogin(admindata)"
                  >Admin Login</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    userdata: {},
    admindata: {}
  }),
  methods: {
    userlogin: function(userdata) {
      this.$http
        .post("/api/common/login/userlogin", userdata, { emulateJSON: true })
        .then(res => {
          if (res.data.status) {
            this.$router.replace({ path: "dashboard" });
            window.location.reload();
          } else alert("Login failed!");
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    },
    adminlogin: function(admindata) {
      this.$http
        .post("/api/common/login/adminlogin", admindata, { emulateJSON: true })
        .then(res => {
          if (res.data.status) {
            this.$router.replace({ path: "dashboard" });
            window.location.reload();
          } else alert("Login failed!");
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    }
  }
};
</script>
