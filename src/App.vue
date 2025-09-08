<script setup lang="ts">
import { ref } from "vue";
import Header from "./components/Header.vue";

let started = ref(false);

const startPray = () => {
    console.log("aoba" + started.value);
    started = ref(true);
};
</script>

<template>
    <Header />
    <section class="container text-center">
        <div class="h-[60dvh]">overflow aqui</div>

        <div>
            <button
                @click="startPray()"
                type="button"
                class="w-full lg:w-[50%] text-4xl font-playfair shadow-xl bg-btn-brown cursor-pointer text-white font-black py-3 rounded-md"
            >
                COMEÇAR
            </button>
        </div>
    </section>
</template>
