<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <TheH :level="1">{{ $t('categories') }}</TheH>

      <TheLink to="/admin/categories/new" class="btn btn-primary">{{ $t('newCategory') }}</TheLink>
    </div>
    <AdminCategoryList :categories="categories" :is-root="true" />
  </div>
</template>

<script setup lang="ts">
const { getCategories } = useYimaAdminCategory()

const { data: categories } = await getCategories()
</script>
