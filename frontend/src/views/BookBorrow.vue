<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout wrap adjust-center>
      <v-flex xs12>
        <material-card color="blue" title="Search books" text="Search for & borrow existing books">
          <v-form>
            <v-container py-0 fluid>
              <v-layout wrap>
                <v-flex xs12 md9>
                  <v-text-field v-model="keyword" label="Keyword"/>
                </v-flex>
                <v-flex xs12 md3 text-xs-right>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="orange"
                    @click="fuzzy_search(keyword)"
                  >fuzzy search</v-btn>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field v-model="bookInfo.BookNo" label="Book No"/>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field v-model="bookInfo.BookName" label="Book Name"/>
                </v-flex>
                <v-flex xs12 md4>
                  <v-text-field v-model="bookInfo.BookType" label="Book Type"/>
                </v-flex>
                <v-flex xs12 md5>
                  <v-text-field v-model="bookInfo.Author" label="Author"/>
                </v-flex>
                <v-flex xs12 md5>
                  <v-text-field v-model="bookInfo.Publisher" label="Publisher"/>
                </v-flex>
                <v-flex xs12 md2 text-xs-right>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="blue"
                    @click="detail_search(bookInfo)"
                  >search</v-btn>
                </v-flex>
                <v-flex md12>
                  <v-data-table :headers="bookData.headers" :items="bookData.items" hide-actions>
                    <template slot="headerCell" slot-scope="{ header }">
                      <span
                        class="font-weight-light text-warning text--darken-3"
                        v-text="header.text"
                      />
                    </template>
                    <template slot="items" slot-scope="{ index, item }">
                      <td>{{ item.BookNo }}</td>
                      <td>{{ item.BookName }}</td>
                      <td>{{ item.BookType }}</td>
                      <td>{{ item.Author }}</td>
                      <td>{{ item.Publisher }}</td>
                      <td>{{ item.Storage+'/'+item.Total }}</td>
                      <td class="justify-center layout px-10">
                        <v-icon color="success" @click="borrowItem(item.BookNo)">mdi-book-plus</v-icon>
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
      bookInfo: {},
      keyword: "",
      bookData: {
        headers: [
          {
            sortable: false,
            text: "ISBN",
            value: "BookNo"
          },
          {
            sortable: false,
            text: "Book Name",
            value: "BookName"
          },
          {
            sortable: false,
            text: "Type",
            value: "BookType"
          },
          {
            sortable: false,
            text: "Author",
            value: "Author"
          },
          {
            sortable: false,
            text: "Publisher",
            value: "Publisher"
          },
          {
            sortable: false,
            text: "Storage",
            value: "Storage"
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
    fuzzy_search: function(keyword) {
      console.log(keyword);
      let data = { keyword: keyword };
      this.$http
        .get(
          "/api/common/library/searchfuzzy",
          { params: data },
          { emulateJSON: true }
        )
        .then(res => {
          console.log(res);
          if (res.data["status"] === false) {
            alert(res.data["info"]);
          } else {
            this.bookData.items = res.data["res"];
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    },
    detail_search: function(bookInfo) {
      this.$http
        .get(
          "/api/common/library/searchdetail",
          { params: bookInfo },
          { emulateJSON: true }
        )
        .then(res => {
          console.log(res.data);
          if (res.data.status === false) {
            alert(res.data.info);
          } else {
            this.bookData.items = res.data.res;
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    },
    borrowItem: function(BookNo) {
      this.$http
        .post("/api/common/library/borrow", { BookNo }, { emulateJSON: true })
        .then(res => {
          if (res.data.status) {
            alert("Borrow succeeded");
            this.fuzzy_search(this.keyword);
          } else {
            alert(res.data.info);
          }
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    }
  }
};
</script>
