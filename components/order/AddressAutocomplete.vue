<template>
  <FormKit
    :id="id"
    ref="autocomplete"
    v-model="autocompleteText"
    type="text"
    :class="classname"
    :placeholder="placeholder"
    :disabled="disabled"
    @focus="onFocus()"
    @blur="onBlur()"
    @change="onChange"
    @keypress="onKeyPress"
    @keyup="onKeyUp"
  />
</template>

<script>
const ADDRESS_COMPONENTS = {
  subpremise: 'short_name',
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  administrative_area_level_2: 'long_name',
  country: 'long_name',
  postal_code: 'short_name',
}

const CITIES_TYPE = ['locality', 'administrative_area_level_3']
const REGIONS_TYPE = [
  'locality',
  'sublocality',
  'postal_code',
  'country',
  'administrative_area_level_1',
  'administrative_area_level_2',
]

/*
  By default, we're only including basic place data because requesting these
  fields place data is not additionally charged by Google. Please refer to:

  https://developers.google.com/maps/billing/understanding-cost-of-use#basic-data
*/
const BASIC_DATA_FIELDS = [
  'address_components',
  'adr_address',
  'alt_id',
  'formatted_address',
  'geometry',
  'icon',
  'id',
  'name',
  'business_status',
  'photo',
  'place_id',
  'scope',
  'type',
  'url',
  'utc_offset_minutes',
  'vicinity',
]

export default {
  name: 'VueGoogleAutocomplete',

  props: {
    id: {
      type: String,
      required: true,
    },

    classname: String,

    placeholder: {
      type: String,
      default: 'Start typing',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    types: {
      type: String,
      default: 'address',
    },

    fields: {
      type: Array,
      default() {
        return BASIC_DATA_FIELDS
      },
    },

    country: {
      type: [String, Array],
      default: null,
    },

    enableGeolocation: {
      type: Boolean,
      default: false,
    },

    geolocationOptions: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      /**
       * The Autocomplete object.
       *
       * @type {Autocomplete}
       * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
       */
      autocomplete: null,

      /**
       * Autocomplete input text
       * @type {String}
       */
      autocompleteText: '',

      geolocation: {
        /**
         * Google Geocoder Objet
         * @type {Geocoder}
         * @link https://developers.google.com/maps/documentation/javascript/reference#Geocoder
         */
        geocoder: null,

        /**
         * Filled after geolocate result
         * @type {Coordinates}
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Coordinates
         */
        loc: null,

        /**
         * Filled after geolocate result
         * @type {Position}
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Position
         */
        position: null,
      },
    }
  },

  watch: {
    autocompleteText(newValue, oldValue) {
      this.$emit('inputChange', { newVal: newValue, oldVal: oldValue }, this.id)
    },
    country(newValue, oldValue) {
      this.autocomplete.setComponentRestrictions({
        country: this.country === null ? [] : this.country,
      })
    },
  },

  mounted() {
    setTimeout(() => {
      const options = {}

      if (this.types) {
        options.types = [this.types]
      }

      if (this.country) {
        options.componentRestrictions = {
          country: this.country,
        }
      }

      this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.id), options)

      this.autocomplete.setFields(this.fields)

      this.autocomplete.addListener('place_changed', this.onPlaceChanged)
    }, 1000)
  },

  methods: {
    /**
     * When a place changed
     */
    onPlaceChanged() {
      const place = this.autocomplete.getPlace()

      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        this.$emit('no-results-found', place, this.id)

        return
      }

      if (place.address_components !== undefined) {
        // Return returnData object and PlaceResult object
        this.$emit('placechanged', this.formatResult(place), place, this.id)

        // Update autocompleteText then emit change event
        this.autocompleteText = document.getElementById(this.id).value
        this.onChange()
      }
    },

    /**
     * When the input gets focus
     */
    onFocus() {
      this.biasAutocompleteLocation()
      this.$emit('focus')
    },

    /**
     * When the input loses focus
     */
    onBlur() {
      this.$emit('blur')
    },

    /**
     * When the input got changed
     */
    onChange() {
      this.$emit('change', this.autocompleteText)
    },

    /**
     * When a key gets pressed
     * @param  {Event} event A keypress event
     */
    onKeyPress(event) {
      this.$emit('keypress', event)
    },

    /**
     * When a keyup occurs
     * @param  {Event} event A keyup event
     */
    onKeyUp(event) {
      this.$emit('keyup', event)
    },

    /**
     * Clear the input
     */
    clear() {
      this.autocompleteText = ''
    },

    /**
     * Focus the input
     */
    focus() {
      this.$refs.autocomplete.focus()
    },

    /**
     * Blur the input
     */
    blur() {
      this.$refs.autocomplete.blur()
    },

    /**
     * Update the value of the input
     * @param  {String} value
     */
    update(value) {
      this.autocompleteText = value
    },

    /**
     * Update the coordinates of the input
     * @param  {Coordinates} value
     */
    updateCoordinates(value) {
      if (!value && !(value.lat || value.lng)) return
      if (!this.geolocation.geocoder) this.geolocation.geocoder = new google.maps.Geocoder()
      this.geolocation.geocoder.geocode({ location: value }, (results, status) => {
        if (status === 'OK') {
          results = this.filterGeocodeResultTypes(results)
          if (results[0]) {
            this.$emit('placechanged', this.formatResult(results[0]), results[0], this.id)
            this.update(results[0].formatted_address)
          } else {
            this.$emit('error', 'no result for provided coordinates')
          }
        } else {
          this.$emit('error', 'error getting address from coords')
        }
      })
    },

    /**
     * Update location based on navigator geolocation
     */
    geolocate() {
      this.updateGeolocation((geolocation, position) => {
        this.updateCoordinates(geolocation)
      })
    },

    /**
     * Update internal location from navigator geolocation
     * @param  {Function} (geolocation, position)
     */
    updateGeolocation(callback = null) {
      if (navigator.geolocation) {
        const options = {}
        if (this.geolocationOptions) Object.assign(options, this.geolocationOptions)
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            this.geolocation.loc = geolocation
            this.geolocation.position = position

            if (callback) callback(geolocation, position)
          },
          (error) => {
            this.$emit('error', 'Cannot get Coordinates from navigator', error)
          },
          options
        )
      }
    },

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    biasAutocompleteLocation() {
      if (this.enableGeolocation) {
        this.updateGeolocation((geolocation, position) => {
          const circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy,
          })
          this.autocomplete.setBounds(circle.getBounds())
        })
      }
    },

    /**
     * Format result from Geo google APIs
     * @param place
     * @returns {{formatted output}}
     */
    formatResult(place) {
      const returnData = {}
      for (let index = 0; index < place.address_components.length; index++) {
        const addressType = place.address_components[index].types[0]

        if (ADDRESS_COMPONENTS[addressType]) {
          const value = place.address_components[index][ADDRESS_COMPONENTS[addressType]]
          returnData[addressType] = value
        }
      }

      returnData.latitude = place.geometry.location.lat()
      returnData.longitude = place.geometry.location.lng()

      return returnData
    },

    /**
     * Extract configured types out of raw result as
     * Geocode API does not allow to do it
     * @param results
     * @returns {GeocoderResult}
     * @link https://developers.google.com/maps/documentation/javascript/reference#GeocoderResult
     */
    filterGeocodeResultTypes(results) {
      if (!results || !this.types) return results
      const output = []
      let types = [this.types]
      if (types.includes('(cities)')) types = [...types, ...CITIES_TYPE]
      if (types.includes('(regions)')) types = [...types, ...REGIONS_TYPE]

      for (const r of results) {
        for (const t of r.types) {
          if (types.includes(t)) {
            output.push(r)
            break
          }
        }
      }

      return output
    },
  },
}
</script>
