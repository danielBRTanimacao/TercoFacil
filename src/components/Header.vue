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
            <nav class="font-playfair text-brown">
                <button
                    type="button"
                    class="px-4 py-2 cursor-pointer bg-light-brown rounded-sm text-lg"
                >
                    Estilizar
                </button>
                <button
                    type="button"
                    class="ms-2 px-4 py-2 cursor-pointer bg-light-brown rounded-sm text-lg"
                >
                    Sobre
                </button>
            </nav>
        </div>
    </header>
</template>
