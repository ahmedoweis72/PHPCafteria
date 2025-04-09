<script setup>
import {ref,onMounted} from 'vue';
import axios from 'axios'; 

const users = ref([]);
//Handle the pagination 

const API_URL = 'http://localhost/PHP_Cafeteria_Backend/public';

const fetchUsers = async ()=>{
  try{
    const response = await axios.get(`${API_URL}/users`);
    //I have to pass token to header to handle admin authorization
    users.value = response.data;

  }catch(err){
    console.error('Failed to fetch user data',err);
  }
}

//Implement the update method here

//Implement the delete method here
const deleteUser = async (UserId)=>{
  if(confirm("Do you really want to delete user?")){
    try{
      await axios.delete(`${API_URL}/users/${UserId}`);
      fetchUsers();
    }catch(err){
      console.err('Failed to delete user:',err);
      alert('Failed to delete user,please try again!');
    }
  }

}

onMounted(()=>{
  fetchUsers();
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

      <!-- Users table -->
      <div class="table-responsive">
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
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <img 
                :src="user.image" 
                :alt="user.name" 
                class="rounded-circle" 
                width="40" 
                height="40"
              >
            </td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.room }}</td>
            <td>
              <span 
                :class="user.role === 'Admin' ? 'badge bg-primary' : 'badge bg-secondary'"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2">
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
        <li class="page-item disabled">
          <a class="page-link" href="#" tabindex="-1">Previous</a>
        </li>
        <li class="page-item active">
          <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">3</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>

  </div>
  
</template>



<style scoped>

</style>