<template>
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-lg mx-auto">
            <h2 class="text-2xl font-bold mb-4">Sobre o Terço Digital</h2>
            <p class="text-gray-700 mb-4">
                Este projeto foi criado para ajudar você a rezar o terço de
                forma simples e digital. Ele foi feito com Vue.js e usa uma
                estrutura dinâmica para adaptar os mistérios de acordo com o dia
                da semana e o tempo litúrgico, como a Quaresma.
            </p>
            <p class="text-gray-700 italic">
                “O Rosário é a mais excelente das orações e o meio mais eficaz
                para alcançar a vida eterna.” — Papa Pio XII
            </p>
            <div class="mt-6 text-right">
                <button
                    @click="$emit('close')"
                    class="bg-brown text-white py-2 px-4 rounded-md font-bold cursor-pointer"
                >
                    Fechar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["close"]);
</script>
