<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 text-center">
          <div class="card">
            <div class="card-body">
              <h1 class="display-1 text-danger">404</h1>
              <h2 class="mb-4">Page Not Found</h2>
              <p class="lead">Oops! The page you're looking for doesn't exist.</p>
              <router-link to="/" class="btn btn-primary">
                <i class="bi bi-house-door"></i> Go Back Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundView'
  }
  </script>
  
  <style scoped>
  .display-1 {
    font-size: 6rem;
    font-weight: 300;
    line-height: 1.2;
  }
  </style>