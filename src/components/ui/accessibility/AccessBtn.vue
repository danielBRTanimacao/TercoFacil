<template>
    <div>
        <button
            @click="toggleAcessibilityMenu"
            class="cursor-pointer fixed top-26 right-4 z-50 rounded-full p-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            aria-label="Abrir opções de acessibilidade"
        >
            <img
                src="https://images.icon-icons.com/91/PNG/512/accessibility_16440.png"
                width="30"
                alt="Ícone de acessibilidade"
            />
        </button>

        <div
            v-if="showAcessibilityOptions"
            class="fixed top-20 right-4 z-50 p-4 bg-white rounded-lg shadow-xl"
            ref="menuRef"
        >
            <h3 class="font-bold mb-2 text-gray-800">
                Opções de Acessibilidade
            </h3>
            <ul class="flex flex-col gap-2">
                <li>
                    <button
                        @click="toggleAutoRead"
                        class="w-full text-left p-2 rounded hover:bg-gray-100 text-gray-800 cursor-pointer"
                    >
                        {{
                            isAutoReadEnabled
                                ? "Desativar Leitura"
                                : "Ativar Leitura Automática"
                        }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import axios from "axios";

const avemariaactual = ref(0);

const props = defineProps({
    currentPrayer: String,
});

const showAcessibilityOptions = ref(false);
const isAutoReadEnabled = ref(false);

const menuRef = ref(null);

let audioPlayer = null;

const speak = async (text) => {
    try {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }

        const response = await axios.post("/api/speak", { text });
        const audioContent = response.data.audioContent;

        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audioPlayer = audio;
        audio.play();
    } catch (error) {
        console.error("Erro ao converter texto para fala:", error);
        const fallbackUtterance = new SpeechSynthesisUtterance(text);
        fallbackUtterance.lang = "pt-BR";
        window.speechSynthesis.speak(fallbackUtterance);
    }
};

const toggleAcessibilityMenu = () => {
    showAcessibilityOptions.value = !showAcessibilityOptions.value;
    if (showAcessibilityOptions.value) {
        speak(
            "Menu de acessibilidade. Opção: Ativar ou desativar leitura automática."
        );
    } else {
        speak("Menu de acessibilidade fechado.");
    }
};

const toggleAutoRead = () => {
    isAutoReadEnabled.value = !isAutoReadEnabled.value;
    const message = isAutoReadEnabled.value
        ? "Leitura automática ativada."
        : "Leitura automática desativada.";
    speak(message);
};

let lastPrayer = "";
watch(
    () => props.currentPrayer,
    (newPrayer) => {
        if (!isAutoReadEnabled.value || newPrayer === lastPrayer) {
            return;
        }

        if (
            newPrayer.includes("Ave Maria") &&
            !lastPrayer.includes("Ave Maria")
        ) {
            if (avemariaactual.value === 0) {
                speak(`${newPrayer}. Esta oração se repete mais duas vezes.`);
                avemariaactual.value = 1;
            } else {
                speak(`${newPrayer}. Esta oração se repete mais nove vezes.`);
            }
        } else {
            speak(newPrayer);
        }

        lastPrayer = newPrayer;
    }
);

const handleClickOutside = (event) => {
    if (
        showAcessibilityOptions.value &&
        menuRef.value &&
        !menuRef.value.contains(event.target) &&
        !event.target.closest("button")
    ) {
        showAcessibilityOptions.value = false;
        speak("Menu de acessibilidade fechado.");
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    if (audioPlayer) {
        audioPlayer.pause();
    }
    window.speechSynthesis.cancel();
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>
