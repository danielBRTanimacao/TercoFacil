<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";

const started = ref(false);

const startPray = () => {
    started.value = !started.value;
};
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <Header />

        <main
            class="flex-1 flex flex-col justify-center items-center text-center"
        >
            <aside class="pt-5 italic" v-if="!started">
                <p class="font-nightshade text-3xl lg:text-5xl text-dark-wine">
                    O Terço é a 'arma' para estes tempos.
                </p>
                <p class="opacity-50 text-sm">~São Padre Pio de Pietrelcina</p>
            </aside>

            <div
                class="h-[55dvh] overflow-auto flex items-center flex-col gap-3"
            >
                <div v-for="value in 15" :key="value">
                    <div
                        v-if="value == 1"
                        class="rounded-full w-10 h-10 bg-gray-900"
                    ></div>
                    <div
                        v-else-if="value == 11"
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
        </main>

        <footer class="p-4" :class="{ 'bg-brown': started }">
            <div
                v-if="!started"
                class="container flex items-center justify-center"
            >
                <button
                    @click="startPray"
                    type="button"
                    class="w-full lg:w-[50%] text-4xl font-playfair shadow-xl bg-brown cursor-pointer text-white font-black py-3 rounded-md"
                >
                    COMEÇAR
                </button>
            </div>
            <aside v-else class="p-2">
                <div class="container">
                    <p
                        class="py-2 text-white text-center md:text-xl font-semibold"
                    >
                        Começar fazendo o creio em Deus pai.
                    </p>
                    <div
                        class="flex md:flex-row gap-5 justify-between text-brown"
                    >
                        <button
                            type="button"
                            class="opacity-75 w-full text-md md:text-xl md:w-75 font-playfair shadow-xl bg-outline-light-brown cursor-pointer font-black py-2 md:py-3 rounded-md"
                        >
                            VOLTAR
                        </button>
                        <button
                            type="button"
                            class="w-full text-md md:text-xl md:w-75 font-playfair shadow-xl bg-light-brown cursor-pointer font-black py-2 md:py-3 rounded-md"
                        >
                            PROSSEGUIR
                        </button>
                    </div>
                </div>
            </aside>
        </footer>
    </div>
</template>
