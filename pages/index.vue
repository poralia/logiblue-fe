<script setup lang="ts">
const calculateResult = useCalculateResult()
</script>

<template>
    <section class="h-screen flex gap-4 py-6">
        <div class="flex-none w-2/5 rounded-lg bg-neutral-100 shadow-sm p-6">
            <client-only>
                <FreightCalculator />
            </client-only>
        </div>

        <div class="flex-none w-3/5 rounded-lg bg-neutral-100 shadow-sm p-6">
            <template v-if="calculateResult">
                <div class="flex border-b border-neutral-300 pb-3 mb-4">
                    <div class="w-32 flex-none">
                        <div class="text-neutral-600">Origin</div>
                        <div class="font-semibold">{{ calculateResult.data.origin }}</div>
                    </div>

                    <div class="block">
                        <div class="text-neutral-600">Destination</div>
                        <div class="font-semibold">{{ calculateResult.data.destination_details.type + ' ' + calculateResult.data.destination_details.city_name + ', ' + calculateResult.data.destination_details.province + ' ' + calculateResult.data.destination_details.postal_code }}</div>
                    </div>
                </div>

                <div class="block mb-2">
                    <div class="text-neutral-600">International Shipping Price</div>
                    <div class="font-semibold">Rp {{ Number(calculateResult.data.international_shipping_price).toLocaleString() }}</div>
                </div>

                <div class="block mb-2">
                    <div class="text-neutral-600">Domestic Shipping Price</div>
                    <div class="font-semibold">Rp {{ Number(calculateResult.data.domestic_price).toLocaleString() }}</div>
                </div>

                <div class="block mb-2">
                    <div class="text-neutral-600">Total Shipping Price</div>
                    <div class="font-semibold">Rp {{ Number(calculateResult.data.total_price).toLocaleString() }}</div>
                </div>
            </template>
        </div>
    </section>
</template>