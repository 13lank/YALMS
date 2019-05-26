<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md5>
        <material-card color="green" title="Add new user" text="Complete profile to add users">
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md12>
                  <v-text-field v-model="nUser.CardId" label="CardId"/>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field v-model="nUser.Name" label="UserName"/>
                </v-flex>
                <v-flex xs12 md6>
                  <v-text-field v-model="nUser.Dept" label="Department"/>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field type="password" v-model="nUser.Password" label="Password"/>
                </v-flex>
                <v-flex xs12 md12>
                  <v-text-field
                    type="password"
                    v-model="nUser.RepeatPassword"
                    label="Repeat Password"
                  />
                </v-flex>
                <v-flex xs12 text-xs-right>
                  <v-btn
                    class="mx-0 font-weight-light"
                    @click="registerUser(nUser)"
                    color="success"
                  >Register User</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </material-card>
      </v-flex>
      <v-flex xs12 md7>
        <material-card
          color="blue"
          title="Existing users"
          text="Search for & manage existing users"
        >
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md3>
                  <v-text-field v-model="sUser.CardId" label="CardId"/>
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field v-model="sUser.Name" label="UserName"/>
                </v-flex>
                <v-flex xs12 md3>
                  <v-text-field v-model="sUser.Dept" label="Department"/>
                </v-flex>
                <v-flex xs12 md3 text-xs-right>
                  <v-btn
                    class="mx-0 font-weight-light"
                    @click="searchUser(sUser)"
                    color="blue"
                  >search</v-btn>
                </v-flex>
                <v-flex md12>
                  <v-data-table :headers="userData.headers" :items="userData.items" hide-actions>
                    <template slot="headerCell" slot-scope="{ header }">
                      <span
                        class="font-weight-light text-warning text--darken-3"
                        v-text="header.text"
                      />
                    </template>
                    <template slot="items" slot-scope="{ index, item }">
                      <td>{{ item.CardId }}</td>
                      <td>{{ item.Name }}</td>
                      <td>{{ item.Dept }}</td>
                      <td class="justify-center layout px-10">
                        <v-icon color="error" @click="deleteItem(item)">mdi-delete</v-icon>
                      </td>
                    </template>
                  </v-data-table>
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
  data() {
    return {
      nUser: {},
      sUser: {},
      userData: {
        headers: [
          {
            sortable: false,
            text: "CardId",
            value: "CardId"
          },
          {
            sortable: false,
            text: "Name",
            value: "Name"
          },
          {
            sortable: false,
            text: "Department",
            value: "Dept"
          },
          {
            sortable: false,
            text: "Actions"
          }
        ],
        items: []
      }
    };
  },
  methods: {
    registerUser: async function(nUser) {
      if (nUser.Password !== nUser.RepeatPassword)
        alert("Passwords don't match!");
      else {
        this.$http
          .post("/api/admin/user/register", nUser, { emulateJSON: true })
          .then(res => {
            console.log(res.data);
            alert(res.data.info);
          })
          .catch(err => {
            alert("Network Error: " + err);
          });
      }
    },
    searchUser: async function(userData) {
      this.$http
        .get(
          "/api/admin/user/search",
          { params: userData },
          { emulateJSON: true }
        )
        .then(res => {
          this.userData.items = res.data.res;
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    }
  }
};
</script>
