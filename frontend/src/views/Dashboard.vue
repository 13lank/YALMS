<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap>
      <v-flex sm6 xs12 md6 lg4>
        <material-stats-card
          color="green"
          icon="mdi-book-open-page-variant"
          title="Borrowings"
          v-model="totalBorrows"
          sub-icon="mdi-calendar"
          sub-text="Total in this year"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg4>
        <material-stats-card
          color="orange"
          icon="mdi-library-books"
          title="Storage"
          v-model="totalBooks"
          sub-icon="mdi-update"
          sub-text="Just Updated"
        />
      </v-flex>
      <v-flex sm6 xs12 md6 lg4>
        <material-stats-card
          color="info"
          icon="mdi-account-group"
          title="total"
          v-model="totalUsers"
          sub-icon="mdi-update"
          sub-text="Just Updated"
        />
      </v-flex>
      <v-flex md12 lg6>
        <material-card color="orange" title="Top Users" text="New user on 15th September, 2016">
          <v-data-table
            :headers="userDashChartData.headers"
            :items="userDashChartData.items"
            hide-actions
          >
            <template slot="headerCell" slot-scope="{ header }">
              <span class="font-weight-light text-warning text--darken-3" v-text="header.text"/>
            </template>
            <template slot="items" slot-scope="{ index, item }">
              <td>{{ item.CardId }}</td>
              <td class="text-xs-right">{{ item.Name }}</td>
              <td class="text-xs-right">{{ item.Dept }}</td>
              <td class="text-xs-right">{{ item.Borrows }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
      <v-flex md12 lg6>
        <material-card color="green" title="Popular Books" text="New book on 15th September, 2016">
          <v-data-table
            :headers="bookDashChartData.headers"
            :items="bookDashChartData.items"
            hide-actions
          >
            <template slot="headerCell" slot-scope="{ header }">
              <span class="font-weight-light text-warning text--darken-3" v-text="header.text"/>
            </template>
            <template slot="items" slot-scope="{ index, item }">
              <td>{{ item.BookName }}</td>
              <td class="text-xs-right">{{ item.BookType }}</td>
              <td class="text-xs-right">{{ item.Author }}</td>
              <td class="text-xs-right">{{ item.Publisher }}</td>
              <td class="text-xs-right">{{ item.Borrows }}</td>
            </template>
          </v-data-table>
        </material-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      totalUsers: 0,
      totalBooks: 0,
      totalBorrows: 0,
      userDashChartData: {
        headers: [
          {
            sortable: false,
            text: "CardId",
            value: "CardId"
          },
          {
            sortable: false,
            text: "Name",
            value: "Name",
            align: "right"
          },
          {
            sortable: false,
            text: "Department",
            value: "Dept",
            align: "right"
          },
          {
            sortable: false,
            text: "Borrows",
            value: "Borrows",
            align: "right"
          }
        ],
        items: []
      },
      bookDashChartData: {
        headers: [
          {
            sortable: false,
            text: "Book Name",
            value: "BookName"
          },
          {
            sortable: false,
            text: "Type",
            value: "Type",
            align: "right"
          },
          {
            sortable: false,
            text: "Author",
            value: "Author",
            align: "right"
          },
          {
            sortable: false,
            text: "Publisher",
            value: "Publisher",
            align: "right"
          },
          {
            sortable: false,
            text: "Borrows",
            value: "borrows",
            align: "right"
          }
        ],
        items: []
      }
    };
  },
  mounted: function() {
    this.loadTopBooks();
    this.loadTopUsers();
    this.loadTotals();
  },
  methods: {
    loadTopBooks: function() {
      this.$http
        .get("/api/common/library/top_books", { emulateJSON: true })
        .then(res => {
          console.log(res.data);
          if (res.data.status === false) {
            alert(res.data.info);
          } else {
            this.bookDashChartData.items = res.data.res;
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    },
    loadTopUsers: function() {
      this.$http
        .get("/api/common/library/top_users", { emulateJSON: true })
        .then(res => {
          console.log(res.data);
          if (res.data.status === false) {
            alert(res.data.info);
          } else {
            this.userDashChartData.items = res.data.res;
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    },
    loadTotals: function() {
      this.$http
        .get("/api/common/library/total_users", { emulateJSON: true })
        .then(res => {
          console.log(res.data);
          if (res.data.status === false) {
            alert(res.data.info);
          } else {
            this.totalUsers = res.data.res;
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
      this.$http
        .get("/api/common/library/total_borrows", { emulateJSON: true })
        .then(res => {
          console.log(res.data);
          if (res.data.status === false) {
            alert(res.data.info);
          } else {
            this.totalBorrows = res.data.res;
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
      this.$http
        .get("/api/common/library/total_books", { emulateJSON: true })
        .then(res => {
          console.log(res.data);
          if (res.data.status === false) {
            alert(res.data.info);
          } else {
            this.totalBooks = res.data.res;
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    }
  }
};
</script>
