import { createStore } from "vuex";
import axios from "axios";
import { apiUrl, LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_ROLE } from "../utils/constants";
import router from "@/router";
import setAuthToken from "../utils/setAuthToken";

export default createStore({
    state: {
        status: null,
        products: [],
        categories: [],
        categoryWord: null,
        carts: [],
        trash: [],
        cartId: null,
        token: localStorage.getItem(LOCAL_STORAGE_TOKEN) || null,
        role: localStorage.getItem(LOCAL_STORAGE_ROLE) || null
    },
    getters: {
        authStatus: state => !!state.status,
        isLoggedIn: state => !!state.token,
        role: state => state.role,
        productsCount: state => state.products.length,
        trashCount: state => state.trash.length
    },
    actions: {
        // Handle login
        async login({ commit, dispatch }, userForm) {
            try {
                const response = await axios.post(`${apiUrl}/auth/login`, userForm);
                if (response.data.success) {
                    localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.accessToken);
                    commit("auth_success", response.data);
                    return response.data;
                }
                dispatch("loadUser");
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        // Handle sign up
        async signUp({ commit }, userForm) {
            try {
                const response = await axios.post(`${apiUrl}/auth/signup`, userForm);
                if (response.data.success) {
                    commit("signed_up", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        // Load logging user
        async loadUser({ commit, state, dispatch }) {
            try {
                if (state.token) {
                    setAuthToken(state.token);
                }
                const response = await axios.post(`${apiUrl}/auth`);
                if (response.data.success) {
                    dispatch("loadCartId", response.data.hasUser.cart._id);
                    commit("load_user", response.data);
                    return response.data;
                }
            } catch (error) {
                localStorage.removeItem(LOCAL_STORAGE_TOKEN);
                setAuthToken(null);
                commit("auth_error");
            }
        },
        async loadCartId({ commit }, cartId) {
            try {
                const response = await axios.post(`${apiUrl}/cart`, { cartId: cartId });
                const filteredCarts = response.data.filteredCarts;
                commit("load_cart", filteredCarts);
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        },
        async clearCart({ state, dispatch }) {
            try {
                const response = await axios.post(`${apiUrl}/user/clearCart`, { cartId: state.cartId });
                dispatch("loadUser");
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        },

        // Handle logout
        logout({ commit }) {
            commit("logout");
            localStorage.removeItem(LOCAL_STORAGE_TOKEN);
            setAuthToken(null);
        },

        searchByCategory({ state }) {
            if (state.categoryWord) {
                state.categories = state.products.filter(item => item.category === state.categoryWord);
            } else {
                state.categories = state.products;
            }
        },
        async addProductToCart({ commit, state }, productId) {
            const item = {
                cartId: state.cartId,
                productId: productId,
                quantity: 1
            };
            try {
                const response = await axios.put(`${apiUrl}/user/addToCart`, item);
                if (response.data.success) {
                    commit("add_to_cart");
                }
            } catch (error) {
                return { success: false, message: error.message };
            }
        },

        // Handle find product
        findProduct({ state }, productId) {
            const product = state.products.find(product => product._id === productId);
            return product;
        },
        // Handle find product in trash
        findProductTrash({ state }, productId) {
            const product = state.trash.find(product => product._id === productId);
            return product;
        },
        async getProducts({ commit }) {
            try {
                const response = await axios.get(`${apiUrl}/home`);
                if (response.data.success) {
                    commit("get_products", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },
        async createProduct({ commit, dispatch }, product) {
            try {
                const response = await axios.post(`${apiUrl}/admin/createProduct`, product);
                if (response.data.success) {
                    commit("create_product", response.data);
                    dispatch("getProducts");
                }
            } catch (error) {
                return { success: false, message: error.message };
            }
        },
        // Handle update post
        async updateProduct({ commit }, updatedProduct) {
            try {
                console.log(updatedProduct);
                const response = await axios.put(`${apiUrl}/admin/${updatedProduct._id}`, updatedProduct);
                commit("update_product", response.data);
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        },
        // Handle get posts
        async getTrash({ commit }) {
            try {
                const response = await axios.get(`${apiUrl}/trash`);
                if (response.data.success) {
                    commit("get_trash", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },
        // Handle delete post
        async deleteProduct({ commit, dispatch }, productId) {
            try {
                const response = await axios.delete(`${apiUrl}/admin/${productId}`);
                if (response.data.success) {
                    commit("delete_product", response.data);
                    dispatch("delItemFromCart", productId);
                    return response.data;
                }
            } catch (error) {
                console.log(error);
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        async deleteAllProducts({ commit }, productIds) {
            try {
                const response = await axios.delete(`${apiUrl}/admin/delete-all`, { data: { productIds } });
                console.log(response.data);
                if (response.data.success) {
                    commit("delete_all", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        async restoreProduct({ commit }, productId) {
            try {
                const response = await axios.patch(`${apiUrl}/admin/${productId}`);
                if (response.data.success) {
                    commit("restore_product", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        async restoreAllProducts({ commit }, productIds) {
            try {
                const response = await axios.patch(`${apiUrl}/admin/restore-all`, { productIds });

                if (response.data.success) {
                    commit("restore_all", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        async forceDeleteAll({ commit, dispatch }, productIds) {
            try {
                const response = await axios.delete(`${apiUrl}/admin/force-delete-all`, { data: { productIds } });
                if (response.data.success) {
                    commit("force_delete_all", response.data);
                    dispatch("getTrash");
                    return response.data;
                }
            } catch (error) {
                return { success: false, message: error.message };
            }
        },

        // Hanlde delete force product
        async forceDelete({ commit }, productId) {
            try {
                const response = await axios.delete(`${apiUrl}/admin/${productId}/force`);
                if (response.data.success) {
                    commit("force_delete", response.data);
                    return response.data;
                }
            } catch (error) {
                if (error.response.data) return error.response.data;
                else return { success: false, message: error.message };
            }
        },

        async delItemFromCart({ commit, state }, productId) {
            try {
                const item = {
                    cartId: state.cartId,
                    productId: productId
                };
                const response = await axios.post(`${apiUrl}/user/delFromCart/`, item);
                if (response.data.success) {
                    commit("del_from_cart");
                }
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        },
        async checkCredit({ commit }) {
            try {
                const response = await axios.post(`${apiUrl}/user/checkCredit`);
                if (response.data.success) {
                    commit("check_credit", response.data);
                }
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        },
        async addCredit({ commit }, credit) {
            try {
                const response = await axios.post(`${apiUrl}/user/addCredit`, credit);
                if (response.data.success) {
                    commit("add_credit");
                } else {
                    commit("check_credit");
                }
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        },
        async addPayment({ commit }, payment) {
            try {
                const response = await axios.post(`${apiUrl}/user/addPayment`, payment);
                console.log(response.data);
                if (response.data.success) {
                    console.log("commit");
                    commit("add_payment");
                }
                return response.data;
            } catch (error) {
                return { success: false, message: error.message };
            }
        }
    },
    mutations: {
        auth_success(state, payload) {
            state.status = payload.message;
            state.token = payload.accessToken;
            location.reload();
        },

        load_user(state, payload) {
            state.status = "success";
            state.cartId = payload.hasUser.cart._id;
            if (payload.hasUser.role.name === "admin") {
                state.role = payload.hasUser.role.name;
                localStorage.setItem(LOCAL_STORAGE_ROLE, state.role);
            } else {
                localStorage.removeItem(LOCAL_STORAGE_ROLE);
            }
        },
        auth_error(state) {
            state.status = "error";
            state.user = null;
            router.push("/login");
        },
        logout(state) {
            state.status = "";
            state.token = "";
            location.reload();
        },
        signed_up(state, payload) {
            state.status = payload.message;
            router.push("/login");
        },
        get_products(state, payload) {
            state.status = "success";
            state.products = payload.hasProducts;
            state.categories = payload.hasProducts;
        },
        update_product(state, payload) {
            state.status = payload.message;
        },
        load_cart(state, payload) {
            state.status = "success";
            state.carts = payload;
        },
        add_to_cart(state) {
            state.status = "Add to cart success";
        },
        del_from_cart(state) {
            state.status = "Del from cart success";
        },
        create_product(state, payload) {
            state.status = payload.message;
        },
        delete_product(state, payload) {
            state.status = payload.message;
            state.products = state.products.filter(product => product._id !== payload.product._id);
        },
        add_credit(state) {
            state.status = "Add Credit Successfully";
        },
        check_credit(state, payload) {
            if (payload.payment) {
                state.status = "You had been registered Credit";
            } else {
                state.status = "You haven't registered Credit";
            }
        },
        add_payment(state) {
            state.status = "Add Payment Successfully";
            console.log("a");
            location.reload();
        },
        get_trash(state, payload) {
            (state.status = "success"), (state.trash = payload.hasTrash);
        },
        delete_all(state, payload) {
            state.status = payload.message;
            state.products = payload.products.filter(product => !product.deleted);
        },
        restore_product(state, payload) {
            state.status = payload.message;
            state.trash = state.trash.filter(product => product._id !== payload.product._id);
        },
        restore_all(state, payload) {
            state.status = payload.message;
            payload.products.map(product => {
                state.trash = state.trash.filter(productTrash => productTrash._id !== product._id);
            });
        },
        force_delete(state, payload) {
            state.status = payload.message;
            state.trash = state.trash.filter(product => product._id !== payload.product._id);
        },
        force_delete_all(state, payload) {
            state.status = payload.message;
            payload.products.map(product => {
                state.trash = state.trash.filter(productTrash => {
                    productTrash._id !== product;
                });
            });
        }
    }
});