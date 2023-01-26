import { useYimaApiAdminCategory } from '#imports'
import type { AsyncDataOptions } from '#app'
import type { YimaFetchOptions } from '~/plugins/http'

declare global {
  interface AdminCategory {
    id: string
    name: string
    isVisible: boolean
    children: AdminCategory[]
    parent: string
    createdAt: string
    updatedAt: string
  }
}

const getCategories = async (options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getCategories } = useYimaApiAdminCategory()

  return getCategories(options, asyncDataOptions)
}

const getCategory = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { getCategory } = useYimaApiAdminCategory()

  return getCategory(id, options, asyncDataOptions)
}

const setCategory = async (
  id: string,
  payload: Partial<AdminCategory>,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  const { setCategory } = useYimaApiAdminCategory()

  return setCategory(id, payload, options, asyncDataOptions)
}

const addCategory = async (
  data: AdminCategory,
  options?: YimaFetchOptions,
  asyncDataOptions?: AsyncDataOptions<any>
) => {
  const { addCategory } = useYimaApiAdminCategory()

  return addCategory(data, options, asyncDataOptions)
}

const deleteCategory = async (id: string, options?: YimaFetchOptions, asyncDataOptions?: AsyncDataOptions<any>) => {
  const { deleteCategory } = useYimaApiAdminCategory()

  return deleteCategory(id, options, asyncDataOptions)
}

export const useYimaAdminCategory = () => {
  return {
    addCategory,
    deleteCategory,
    getCategory,
    getCategories,
    setCategory,
  }
}
