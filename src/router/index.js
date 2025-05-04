// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  // Optional: Add future routes here like /note/:id or /about
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
