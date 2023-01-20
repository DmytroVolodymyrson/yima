<template>
  <slot name="label" />
  <slot :format-tooltip="formatTooltip" name="default">
    <Slider
      v-model="slider"
      tooltip="text-lg"
      :min="min"
      :max="max"
      :format="price && formatTooltip"
      :step="step"
      v-bind="$attrs"
      class="ng-range-slider mt-5"
    />
  </slot>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from '#imports'
import Slider from '@vueform/slider'
import { withDefaults } from 'vue'

interface Properties {
  max: number
  maxSelected: number
  min: number
  minSelected: number
  price?: boolean
  step?: number
  resetData?: boolean
}

const properties = withDefaults(defineProps<Properties>(), {
  max: 100,
  maxSelected: 80,
  min: 1,
  minSelected: 20,
  price: true,
  step: 1,
  resetData: false,
})

const emits = defineEmits(['price-filter-change'])

const { min, max, minSelected, maxSelected, resetData } = toRefs(properties)
const slider = ref([minSelected.value, maxSelected.value])

function formatTooltip(value: number) {
  return new Intl.NumberFormat('uk', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'uah',
  }).format(value)
}

watch(resetData, (value) => {
  if (value) {
    slider.value = [min.value, max.value]
  }
})

watch(slider, (value) => {
  if (!resetData.value) {
    emits('price-filter-change', value)
  }
})
</script>