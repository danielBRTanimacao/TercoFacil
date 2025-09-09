<script setup lang="ts">
import { ref } from "vue";
import Header from "./components/Header.vue";

const started = ref(false);

const startPray = () => {
    started.value = !started.value;
};
</script>

<template>
    <Header />
    <section class="container text-center">
        <div class="h-[60dvh]">overflow aqui</div>

        <div v-if="!started">
            <button
                @click="startPray"
                type="button"
                class="w-full lg:w-[50%] text-4xl font-playfair shadow-xl bg-btn-brown cursor-pointer text-white font-black py-3 rounded-md"
            >
                COMEÇAR
            </button>
        </div>

        <div v-else class="flex gap-5 justify-between">
            <button
                @click="startPray"
                type="button"
                class="w-full text-4xl font-playfair shadow-xl bg-btn-brown cursor-pointer text-white font-black py-3 rounded-md"
            >
                VOLTAR
            </button>
            <button
                @click="startPray"
                type="button"
                class="w-full text-4xl font-playfair shadow-xl bg-btn-brown cursor-pointer text-white font-black py-3 rounded-md"
            >
                PROSSEGUIR
            </button>
        </div>
    </section>
</template>
