<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12>
        <material-card color="warning" title="Manage Borrows" text="Manage user borrow records.">
          <v-layout wrap>
            <v-flex xs12>
              <v-data-table :headers="recordData.headers" :items="recordData.items" hide-actions>
                <template slot="headerCell" slot-scope="{ header }">
                  <span class="font-weight-light text-warning text--darken-3" v-text="header.text"/>
                </template>
                <template slot="items" slot-scope="{ index, item }">
                  <td>{{ item.RID }}</td>
                  <td>{{ item.Book.BookNo }}</td>
                  <td>{{ item.Book.BookName }}</td>
                  <td>{{ item.LentDate }}</td>
                  <td>{{ item.ReturnDate }}</td>
                  <td class="justify-center layout px-10">
                    <v-icon color="success" @click="returnItem(item.RID)">mdi-book-minus</v-icon>
                  </td>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      recordData: {
        headers: [
          {
            sortable: false,
            text: "RID",
            value: "RID"
          },
          {
            sortable: false,
            text: "BookNo",
            value: "BookNo"
          },
          {
            sortable: false,
            text: "Book Name",
            value: "BookName"
          },
          {
            sortable: true,
            text: "Borrow Date",
            value: "LentDate"
          },
          {
            sortable: true,
            text: "Return Date",
            value: "ReturnDate"
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
  mounted() {
    this.loadUserRentStatus();
  },
  methods: {
    loadUserRentStatus: function() {
      this.$http
        .get("/api/common/library/user_rent_status", { emulateJSON: true })
        .then(res => {
          console.log(res.data);
          if (res.data.status === true) {
            this.recordData.items = res.data.res;
          } else alert(res.info);
        })
        .catch(err => {
          alert("Network Error:", err);
        });
    },
    returnItem: function(RID) {
      this.$http
        .post("/api/common/library/return", { RID }, { emulateJSON: true })
        .then(res => {
          if (res.data.status === false) alert(res.data.info);
          else {
            alert("Return Succeeded!");
            this.loadUserRentStatus();
          }
        })
        .catch(err => {
          alert("Network Error:", err);
        });
    }
  }
};
</script>
