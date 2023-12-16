<script setup lang="ts">
import { ref, onMounted } from 'vue';

const runtimeConfig = useRuntimeConfig()
const calculateResult = useCalculateResult()
const selectedCountry = ref('')
const selectedCategory = ref('')
const selectedCity = ref('')
const selectedWeight = ref()

let categoriesState = useState<any[]>('categories', () => {
    return []
})

const { pending: pendingCountry, data: countries } = useFetch(
    `${runtimeConfig.public.baseApiUrl}/tracking/countries/`,
    {
        lazy: true,
        server: false
    }
)

const autoCompleteCities = () => {
    // @ts-ignore
    const autoCompleteJS = new autoComplete({
        selector: "#autoComplete",
        placeHolder: "Enter city name",
        debounce: 250,
        data: {
            src: async (query: string) => {
                let apiUrl = `${runtimeConfig.public.baseApiUrl}/tracking/cities/`
                if (query) {
                    `${runtimeConfig.public.baseApiUrl}/tracking/cities/?search=${query}`
                }

                try {
                    const source = await fetch(apiUrl)
                    const { data } = await source.json()
                    const results = data.map((item: any) => {
                        return {
                            ...item,
                            city_name: `${item.type} ${item.city_name}`,
                        }
                    })
                    
                    return results
                } catch(error) {
                    return error;
                }
            },
            cache: true,
            keys: ['city_name'],
        },
        events: {
            input: {
                selection: (event: any) => {
                    const selection = event.detail.selection.value
                    // @ts-ignore
                    autoCompleteJS.input.value = selection.city_name

                    selectedCity.value = selection.city_id
                }
            }
        }
    })
}

onMounted(() => {
    autoCompleteCities()
})

const selectedCountryHandler = (event: any) => {
    // reset selected category
    selectedCategory.value = ''

    const { data: results } = useFetch(
        `${runtimeConfig.public.baseApiUrl}/tracking/categories/?country_code=${selectedCountry.value}`, 
        {
            lazy: true,
            server: false,
        }
    )

    // @ts-ignore
    categoriesState.value = results
}

// submit the form
const submitHandler = async (event: any) => {
    calculate()
}

// calculate handler
const calculate = () => {
    const payload = {
        country_code: selectedCountry,
        category_id: selectedCategory,
        destination_id: selectedCity,
        weight: selectedWeight,
    }

    const { pending: pending, data: result, execute: executeCalulate } = useFetch(
        `${runtimeConfig.public.baseApiUrl}/tracking/calculate/`,
        {
            method: 'post',
            lazy: true,
            server: false,
            body: payload,
            immediate: false,
        }
    )
    
    executeCalulate()
    calculateResult.value = result
}
</script>

<template>
    <section>
        <form @submit.prevent="submitHandler($event)">
            <div class="font-bold mb-2">Freight Calculator</div>
            <div class="block mb-4">
                <div class="mb-1">Origin</div>
                <select 
                    v-model="selectedCountry"
                    @change.prevent="selectedCountryHandler($event)"
                    class="border border-neutral-300 px-2 py-2 w-full rounded-lg"
                >
                    <template v-if="pendingCountry">
                        <option disabled value="">Loading...</option>
                    </template>
                    <template v-else>
                        <option value="">Select a country</option>
                        <template v-for="country of countries">
                            <option :value="country.iso_code">{{ country.name }}</option>
                        </template>
                    </template>
                </select>
            </div>

            <div class="block mb-4">
                <div class="mb-1">Destination</div>
                <input 
                    id="autoComplete"
                    name="autoCompleteCity"
                    type="search"
                    dir="ltr"
                    spellcheck="false"
                    autocorrect="off"
                    autocomplete="off"
                    autocapitalize="off"
                    class="!border !border-neutral-200 !rounded-lg !w-full !pr-2 !pl-11 !py-2 !h-auto"
                    :style="{
                        'background-position': 'left .75rem top .7rem !important'
                    }"
                />
            </div>

            <div class="block mb-4">
                <div class="mb-1">Product Category</div>
                <select v-model="selectedCategory" :disabled="!selectedCountry" class="border border-neutral-300 px-2 py-2 w-full rounded-lg">
                    <option value="">{{ !selectedCountry ? 'Select origin first' : 'Select category' }}</option>
                    <template v-for="category of categoriesState">
                        <option :value="category.id">{{ category.title }}</option>
                    </template>
                </select>
            </div>

            <div class="block mb-4">
                <div class="mb-1">Total Weight (kg)</div>
                <input 
                    v-model="selectedWeight"
                    placeholder="0"
                    type="number"
                    class="border border-neutral-300 px-2 py-2 w-full rounded-lg"
                />
            </div>

            <button
                type="submit"
                class="bg-sky-700 hover:bg-sky-800 text-white rounded-lg px-2 py-2 w-full text-center block"
                :disabled="!selectedCategory || !selectedCity || !selectedCountry || !selectedWeight"
            >
                Calculate
            </button>
        </form>
    </section>
</template>