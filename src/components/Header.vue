<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
    <header class="bg-brown py-5 mb-5">
        <div
            class="container flex items-center justify-between text-white font-black"
        >
            <div class="text-center">
                <img src="../assets/icons/coal.png" alt="img" />
                <p>{{ count }}</p>
            </div>
            <nav class="font-playfair">
                <button
                    type="button"
                    class="px-4 py-2 cursor-pointer bg-light-brown rounded-full text-lg"
                >
                    Estilizar
                </button>
                <button
                    type="button"
                    class="ms-2 px-4 py-2 cursor-pointer bg-light-brown rounded-full text-lg"
                >
                    Sobre
                </button>
            </nav>
        </div>
    </header>
    <aside class="text-center pt-5 italic">
        <p class="font-nightshade text-3xl lg:text-5xl text-dark-wine">
            O Terço é a 'arma' para estes tempos.
        </p>
        <p class="opacity-50 text-sm">~São Padre Pio de Pietrelcina</p>
    </aside>
</template>
