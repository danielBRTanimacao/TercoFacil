<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";

const started = ref(false);

const startPray = () => {
    started.value = !started.value;
};
</script>

<template>
    <Header />
    <aside class="text-center pt-5 italic" v-if="!started">
        <p class="font-nightshade text-3xl lg:text-5xl text-dark-wine">
            O Terço é a 'arma' para estes tempos.
        </p>
        <p class="opacity-50 text-sm">~São Padre Pio de Pietrelcina</p>
    </aside>
    <section class="text-center">
        <div class="h-[50dvh] overflow-auto flex items-center flex-col gap-3">
            <div v-for="value in 14" :key="value">
                <div
                    v-if="value == 11"
                    class="rounded-full w-10 h-10 bg-gray-900"
                ></div>
                <div v-else class="rounded-full w-6 h-6 bg-gray-900"></div>
            </div>

            <img
                width="175"
                src="https://png.pngtree.com/png-vector/20240517/ourmid/pngtree-jesus-crucifix-narrative-composition-png-image_12474882.png"
                alt=""
            />
        </div>

        <article class="">
            <div v-if="!started">
                <div class="container">
                    <button
                        @click="startPray"
                        type="button"
                        class="w-full lg:w-[50%] text-4xl font-playfair shadow-xl bg-brown cursor-pointer text-white font-black py-3 rounded-md"
                    >
                        COMEÇAR
                    </button>
                </div>
            </div>
            <aside v-else class="bg-brown p-2">
                <div class="container">
                    <p class="py-2 text-white">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nisi at quidem quo modi praesentium beatae. Commodi
                        facilis totam, facere odio animi doloribus enim ullam.
                        Odit aperiam ipsa ducimus quidem voluptate.
                    </p>
                    <div
                        class="flex flex-col md:flex-row gap-5 justify-between text-brown"
                    >
                        <button
                            type="button"
                            class="w-full text-lg md:text-4xl font-playfair shadow-xl bg-light-brown cursor-pointer font-black py-2 md:py-3 rounded-md"
                        >
                            VOLTAR
                        </button>
                        <button
                            type="button"
                            class="w-full text-lg md:text-4xl font-playfair shadow-xl bg-light-brown cursor-pointer font-black py-2 md:py-3 rounded-md"
                        >
                            PROSSEGUIR
                        </button>
                    </div>
                </div>
            </aside>
        </article>
    </section>
</template>
