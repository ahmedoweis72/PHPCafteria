<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const users = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const showEditForm = ref(false);

const router = useRouter();

const updateUser = (userId) => {
  router.push({
    name: 'updateUser',
    params: { id: userId }
  })
};
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/PHP_Cafeteria_Backend/public';


const token = localStorage.getItem('token');

const fetchUsers = async (page = 1) => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/users`, {
      params: { page },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    users.value = response.data.data;
    totalPages.value = response.data.pagination.last_page;
    currentPage.value = page;
    // console.log(users.value);
    // console.log(response.data.pagination);

  } catch (err) {
    console.error('Failed to fetch user data', err);
  } finally {
    loading.value = false;
  }
}

//Handle the pagination 
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUsers(page);
  }
}


//Implement the delete method here
const deleteUser = async (UserId) => {
  if (confirm("Do you really want to delete user?")) {
    try {
      await axios.delete(`${API_URL}/users/${UserId}`);
      fetchUsers(currentPage.value);
    } catch (err) {
      console.err('Failed to delete user:', err);
      alert('Failed to delete user,please try again!');
    }
  }

}

onMounted(() => {
  fetchUsers(1);
})


</script>

<template>
  <div class="users-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2">All Users</h1>
      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i> Add User
      </button>
    </div>

    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Users table -->
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Room</th>
            <th scope="col">Role</th>
            <th scope="col" class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <th scope="row">{{ (currentPage - 1) * 6 + index + 1 }}</th>
            <td>
              <img :src="user.image" :alt="user.name" class="rounded-circle" width="40" height="40">
            </td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roomNum }}</td>
            <td>
              <span :class="user.role === 'admin' ? 'badge bg-primary' : 'badge bg-secondary'">
                {{ user.role }}
              </span>
            </td>
            <td class="text-center">
              <button @click="updateUser(user.id)" class="btn btn-sm btn-outline-primary me-2">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
          <!-- <tr v-if="filteredUsers.length === 0">
            <td colspan="7" class="text-center py-4">
              No users found.
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>

    <nav aria-label="Users pagination" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
          <a class="page-link" @click.prevent="changePage(currentPage + 1)" href="#">Next</a>
        </li>
      </ul>
    </nav>

  </div>

</template>



<style scoped></style>