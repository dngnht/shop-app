import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Admin from "../views/admin/Admin.vue";
import Login from "../components/Login.vue";
import Signup from "../components/Signup.vue";
import About from "../views/About.vue";
import Cart from "../components/Cart.vue";
import Trash from "../views/admin/Trash.vue";
import Error from "../components/Error.vue";
import store from "../store";

const routes = [{
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup
    },
    {
        path: "/about",
        name: "About",
        component: About
    },
    {
        path: "/admin",
        name: "Admin",
        params: true,
        component: Admin,
        meta: { reqAuth: true, reqAdmin: true }
    },
    {
        path: "/cart",
        name: "Cart",
        component: Cart
    },
    {
        name: "Trash",
        path: "/admin/trash",
        component: Trash,
        meta: { reqAuth: true, reqAdmin: true }
    },
    {
        name: "Error",
        path: "/:pathMatch(.*)*",
        component: Error
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// Router guard
router.beforeEach(to => {
    if (to.meta.reqAuth && !store.getters.isLoggedIn) {
        return {
            path: "/signin"
        };
    }
    if (to.meta.reqAdmin && store.getters.role !== "admin") {
        return {
            path: "/error"
        };
    }
    document.title = `Shop app - ${to.name}`;
});

export default router;