<template>
    <div
        class="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto w-75">
            <div class="flex items-center justify-between w-full">
                <h2 class="text-2xl font-bold opacity-50 font-playfair">
                    TEMA PRINCIPAL
                </h2>
                <button
                    @click="emit('close')"
                    class="relative rounded-md font-bold cursor-pointer transition-all hover:text-gray-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        fill="currentColor"
                        class="bi bi-x-lg"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
                        />
                    </svg>
                </button>
            </div>
            <div class="flex flex-col gap-4 mt-6 my-4">
                <button
                    @click="emit('change-theme', 'brown')"
                    class="bg-hardcoded-brown text-white py-3 px-8 rounded-md font-bold cursor-pointer"
                >
                    Marrom
                </button>
                <button
                    @click="emit('change-theme', 'purple')"
                    class="bg-purple-700 text-white py-3 px-8 rounded-md font-bold cursor-pointer"
                >
                    Vinho
                </button>
            </div>
            <div>
                <h2 class="text-2xl font-bold opacity-50 font-playfair">
                    COR DAS CASAS
                </h2>
                <article class="flex items-center justify-center gap-3">
                    <div
                        v-for="color in beadColors"
                        :key="color"
                        :class="[
                            color,
                            'h-12 w-12 rounded-full circle-3d',
                            { selected: selectedColor === color },
                        ]"
                        @click="emit('change-bead-color', color)"
                    ></div>
                </article>
            </div>

            <div class="mt-4">
                <h2 class="text-2xl font-bold opacity-50 font-playfair">
                    DESATIVAR CONTADOR
                </h2>

                <label class="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        value=""
                        class="sr-only peer"
                        checked
                    />
                    <div
                        class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
                    ></div>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["close", "change-theme", "change-bead-color"]);

const props = defineProps({
    selectedColor: {
        type: String,
        default: "bg-gray-900",
    },
});

const beadColors = ["bg-gray-900", "bg-white", "bg-pink-900", "bg-orange-600"];
</script>
