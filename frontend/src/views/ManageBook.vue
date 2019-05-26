<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md5>
        <v-layout wrap row>
          <v-flex xs12>
            <material-card color="green" title="Add new book" text="Complete profile to add books">
              <v-form>
                <v-container py-0>
                  <v-layout wrap>
                    <v-flex xs12 md6 sm6 lg3>
                      <v-text-field v-model="newBook.BookNo" label="Book No"/>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-text-field v-model="newBook.BookName" label="Book Name"/>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="newBook.BookType" label="Book Type"/>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="newBook.Author" label="Author"/>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="newBook.Publisher" label="Publisher"/>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="newBook.Total" label="Total"/>
                    </v-flex>
                    <v-flex xs12 md4>
                      <v-text-field v-model="newBook.Price" label="Price(RMB)"/>
                    </v-flex>
                    <v-flex xs12 md4 text-xs-right>
                      <v-btn
                        class="mx-0 font-weight-light"
                        color="success"
                        @click="add_book(newBook)"
                      >Add Book</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </material-card>
          </v-flex>
          <v-flex xs12>
            <material-card>
              <v-layout wrap>
                <v-flex xs12 text-xs-center>
                  <v-btn class="mx-0 font-weight-light" color="error">Add Books From File</v-btn>
                </v-flex>
              </v-layout>
            </material-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 md7>
        <material-card
          color="blue"
          title="Existing books"
          text="Search for & manage existing books"
        >
          <v-form>
            <v-container py-0>
              <v-layout wrap>
                <v-flex xs12 md9>
                  <v-text-field v-model="keyword" label="Keyword"/>
                </v-flex>
                <v-flex xs12 md3>
                  <v-btn
                    class="mx-0 font-weight-light"
                    color="orange"
                    text-xs-right
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
                <v-flex xs12 md2>
                  <v-btn class="mx-0 font-weight-light" color="blue">search</v-btn>
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
                        <v-icon color="error" @click="deleteItem(item.BookNo)">mdi-delete</v-icon>
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
import VueResource from "vue-resource";
export default {
  data() {
    return {
      keyword: "",
      bookInfo: {},
      newBook: {},
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
    fuzzy_search: async function(keyword) {
      console.log(keyword);
      this.$http
        .get(
          "/api/common/library/searchfuzzy",
          { params: { keyword: keyword } },
          { emulateJSON: true }
        )
        .then(res => {
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
    detail_search: async function(bookInfo) {
      this.$http
        .get(
          "/api/common/library/searchdetail",
          { params: bookInfo },
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
    add_book: async function(newBook) {
      this.$http
        .post("/api/admin/book/addbooks", [newBook], { emulateJSON: true })
        .then(res => {
          alert(res.data.info);
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    },
    deleteItem: async function(BookNo) {
      this.$http
        .post(
          "/api/admin/book/delete",
          { BookNo: BookNo },
          { emulateJSON: true }
        )
        .then(res => {
          alert(res.data.info);
        })
        .catch(err => {
          alert("Network Error: " + err);
        });
    }
  }
};
</script>
