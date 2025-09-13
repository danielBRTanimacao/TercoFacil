<script setup>
const props = defineProps({
    daysPrayed: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(["open-about", "open-style"]);
</script>

<template>
    <header class="bg-brown py-5 mb-5">
        <div
            class="container flex items-center justify-between text-white font-black"
        >
            <div class="text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="31"
                    height="31"
                    fill="currentColor"
                    class="bi bi-fire"
                    viewBox="0 0 16 16"
                >
                    <path
                        d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"
                    />
                </svg>
                <p>{{ props.daysPrayed }}</p>
            </div>
            <nav class="font-playfair text-brown">
                <button
                    type="button"
                    class="px-4 py-2 cursor-pointer rounded-sm text-lg opacity-75 bg-outline-light-brown"
                    @click="emit('open-style')"
                >
                    Estilizar
                </button>
                <button
                    type="button"
                    class="ms-2 px-4 py-2 cursor-pointer opacity-75 bg-outline-light-brown rounded-sm text-lg"
                    @click="emit('open-about')"
                >
                    Sobre
                </button>
            </nav>
        </div>
    </header>
</template>
