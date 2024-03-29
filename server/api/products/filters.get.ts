import { client } from '~/server/lib/typesense'
import { ClientCategoryCache } from '~/server/lib/clientCategoryCache'

export default defineEventHandler(async () => {
  const filters = []

  const categoryItems = await ClientCategoryCache.getCustomerCategories()
  if (categoryItems.length > 0) {
    filters.push({ sectionName: 'categories', items: categoryItems })
  }

  const facedPriceResponse = await client
    .collections('products')
    .documents()
    .search({ q: '*', query_by: 'name', facet_by: 'price', per_page: 0 })

  if (!facedPriceResponse.facet_counts) {
    return filters
  }

  const { min, max } = facedPriceResponse.facet_counts[0].stats

  if (!min || !max) {
    return filters
  }

  filters.push({ sectionName: 'price', items: [{ min, max, type: 'range', id: 'price' }] })

  return filters
})
