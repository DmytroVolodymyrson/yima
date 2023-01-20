import { useNuxtApp, urlPrefix } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

const getCategories = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  return useNuxtApp().$http.get<Category[]>(`${urlPrefix}/categories`, options, asyncDataOptions)
}

export const useYimaApiCategory = () => {
  return {
    getCategories,
  }
}
