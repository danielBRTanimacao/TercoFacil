<template>
    <div
        class="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
            <h2 class="text-2xl font-bold mb-4">Escolha seu TEMA</h2>
            <div class="flex justify-center gap-4 mt-6 mb-4">
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
            <div class="mt-6 text-right">
                <button
                    @click="emit('close')"
                    class="bg-gray-400 text-white py-2 px-4 rounded-md font-bold cursor-pointer"
                >
                    Fechar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["close", "change-theme"]);
</script>
