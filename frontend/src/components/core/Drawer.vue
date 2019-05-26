<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img :src="image" height="100%">
      <v-layout class="fill-height" tag="v-list" column>
        <v-list-tile avatar>
          <v-list-tile-avatar color="white">
            <v-img :src="logo" height="34" contain/>
          </v-list-tile-avatar>
          <v-list-tile-title class="title">YALMS</v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile v-if="responsive">
          <v-text-field class="purple-input search-input" label="Search..." color="purple"/>
        </v-list-tile>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="link.text"/>
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
// eslint-disable-next-line
import { mapMutations, mapState } from "vuex";

export default {
  data: () => ({
    logo: "./img/logo.png",
    links: [
      {
        to: "/dashboard",
        icon: "mdi-view-dashboard",
        text: "Dashboard"
      },
      {
        to: "/manage-user",
        icon: "mdi-account-multiple",
        text: "Manage Users"
      },
      {
        to: "/manage-book",
        icon: "mdi-library-books",
        text: "Manage Books"
      },
      {
        to: "/borrow-book",
        icon: "mdi-book-multiple-plus",
        text: "Borrow Books"
      },
      {
        to: "/manage-borrows",
        icon: "mdi-book-multiple-variant",
        text: "Manage Borrows"
      },
      {
        to: "/login",
        icon: "mdi-login",
        text: "Login"
      },
      {
        to: "/logout",
        icon: "mdi-logout",
        text: "logout"
      }
    ],
    default_links: [
      {
        to: "/dashboard",
        icon: "mdi-view-dashboard",
        text: "Dashboard"
      },
      {
        to: "/login",
        icon: "mdi-login",
        text: "Login"
      }
    ],
    user_links: [
      {
        to: "/dashboard",
        icon: "mdi-view-dashboard",
        text: "Dashboard"
      },
      {
        to: "/borrow-book",
        icon: "mdi-book-multiple-plus",
        text: "Borrow Books"
      },
      {
        to: "/manage-borrows",
        icon: "mdi-book-multiple-variant",
        text: "Manage Borrows"
      },
      {
        to: "/logout",
        icon: "mdi-logout",
        text: "logout"
      }
    ],
    admin_links: [
      {
        to: "/dashboard",
        icon: "mdi-view-dashboard",
        text: "Dashboard"
      },
      {
        to: "/manage-user",
        icon: "mdi-account-multiple",
        text: "Manage Users"
      },
      {
        to: "/manage-book",
        icon: "mdi-library-books",
        text: "Manage Books"
      },
      {
        to: "/logout",
        icon: "mdi-logout",
        text: "logout"
      }
    ],
    responsive: false
  }),
  computed: {
    ...mapState("app", ["image", "color"]),
    inputValue: {
      get() {
        return this.$store.state.app.drawer;
      },
      set(val) {
        this.setDrawer(val);
      }
    },
    items() {
      return this.$t("Layout.View.items");
    }
  },
  mounted: function() {
    this.$http
      .get("/api/common/login/status", { emulateJSON: true })
      .then(res => {
        if (res.data.type === "user") this.links = this.user_links;
        else if (res.data.type === "admin") this.links = this.admin_links;
        else this.links = this.default_links;
        this.onResponsiveInverted();
        window.addEventListener("resize", this.onResponsiveInverted);
      })
      .catch(err => {
        alert("Network Error: " + err);
      });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  methods: {
    ...mapMutations("app", ["setDrawer", "toggleDrawer"]),
    onResponsiveInverted() {
      if (window.innerWidth < 991) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    }
  }
};
</script>

<style lang="scss">
#app-drawer {
  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }
  }

  .v-image__image--contain {
    top: 9px;
    height: 60%;
  }

  .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
