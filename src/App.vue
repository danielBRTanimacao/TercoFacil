<script setup>
import { ref, onMounted } from "vue";

import TercoComun from "./assets/json/terco_comum.json";
import TercoQuaresma from "./assets/json/terco_quaresma.json";

import Header from "./components/Header.vue";
import About from "./components/ui/modal/About.vue";

const crucifixImage = ref(null);
const focusMistery = ref(17);

const started = ref(false);
const showButtons = ref(false);
const countdown = ref(5);
const showAboutModal = ref(false);

const tercoData = ref(null);
const oracoesDoDia = ref(null);
const misteriosDoDia = ref(null);
const currentStep = ref(0);
const currentPrayer = ref("");
const stepType = ref("");
const daysPrayed = ref(0);
const currentMystery = ref(0);

const aveMariaCount = ref(0);
const totalAveMarias = ref(0);

const lagerMistery = [1, 12, 16];

const daysMap = {
    domingo: "domingo",
    "segunda-feira": "segunda",
    "terça-feira": "terça",
    "quarta-feira": "quarta",
    "quinta-feira": "quinta",
    "sexta-feira": "sexta",
    sábado: "sábado",
};

const startPray = () => {
    started.value = true;
    showButtons.value = false;
    countdown.value = 5;

    const dayNameFull = new Date()
        .toLocaleDateString("pt-BR", { weekday: "long" })
        .toLowerCase();
    const dayOfWeek = daysMap[dayNameFull];

    if (!dayOfWeek) {
        console.error("Nome do dia da semana não encontrado no mapeamento.");
        return;
    }

    tercoData.value = isQuarema() ? TercoQuaresma : TercoComun;
    oracoesDoDia.value = tercoData.value.dias[dayOfWeek].oracoes;
    misteriosDoDia.value = tercoData.value.dias[dayOfWeek].oracoes.misterios;

    currentStep.value = 0;
    aveMariaCount.value = 0;
    updateContent();

    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            clearInterval(timer);
            showButtons.value = true;
        }
    }, 1000);

    focusMistery.value = 17;
    if (crucifixImage.value) {
        crucifixImage.value.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
};

const nextStep = () => {
    currentStep.value++;
    updateContent();

    if (currentStep.value === 1) {
        focusMistery.value = 17;
    } else if (currentStep.value === 2) {
        focusMistery.value = 16;
    } else if (currentStep.value === 3) {
        focusMistery.value = 15;
    } else if (currentStep.value === 4) {
        focusMistery.value = 14;
    } else if (currentStep.value === 5) {
        focusMistery.value = 13;
    } else if (currentStep.value === 6) {
        focusMistery.value = 12;
    } else if (stepType.value === "anunciacaoMisterio") {
        const mysteryBase = 12 - currentMystery.value * 2;
        focusMistery.value = mysteryBase;
    } else if (stepType.value === "paiNosso" && currentStep.value > 6) {
        const mysteryBase = 12 - currentMystery.value * 2;
        focusMistery.value = mysteryBase;
    } else if (stepType.value === "aveMaria" && totalAveMarias.value === 10) {
        const mysteryBase = 11 - currentMystery.value * 2;
        focusMistery.value = mysteryBase;
    } else if (stepType.value === "gloria" && currentStep.value > 6) {
        focusMistery.value = 1;
    } else if (stepType.value === "salveRainha") {
        focusMistery.value = 1;
    } else {
        focusMistery.value = 0;
    }

    showButtons.value = false;
    countdown.value = 5;
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            clearInterval(timer);
            showButtons.value = true;
        }
    }, 1000);

    const focusedBead = document.getElementById(`bead-${focusMistery.value}`);
    if (focusedBead) {
        focusedBead.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
};

const prayAveMaria = () => {
    if (aveMariaCount.value < totalAveMarias.value) {
        aveMariaCount.value++;

        if (totalAveMarias.value === 3) {
            focusMistery.value = 15 - (aveMariaCount.value - 1);
        } else if (totalAveMarias.value === 10) {
            const mysteryStartBead = 11;
            const currentAveMariaBead =
                mysteryStartBead - (aveMariaCount.value - 1);
            focusMistery.value = currentAveMariaBead;
        }
    }

    if (aveMariaCount.value === totalAveMarias.value) {
        nextStep();
    }
};

const getSteps = (oracoes, misterios) => {
    const steps = [];
    steps.push({ type: "inicio", text: oracoes.inicio });
    steps.push({ type: "creio", text: oracoes.crucifixo });
    steps.push({ type: "paiNosso", text: oracoes.paiNosso });
    steps.push({ type: "aveMaria", text: oracoes.aveMaria, count: 3 });
    steps.push({ type: "gloria", text: oracoes.gloria });

    for (let i = 0; i < 5; i++) {
        steps.push({ type: "anunciacaoMisterio", text: misterios[i] });
        steps.push({ type: "paiNosso", text: oracoes.paiNosso });
        steps.push({ type: "aveMaria", text: oracoes.aveMaria, count: 10 });
        steps.push({ type: "gloria", text: oracoes.gloria });
    }

    steps.push({ type: "salveRainha", text: oracoes.salveRainha });
    return steps;
};

const updateContent = () => {
    const oracoes = oracoesDoDia.value;
    const misterios = misteriosDoDia.value;

    const steps = getSteps(oracoes, misterios);
    aveMariaCount.value = 0;

    if (currentStep.value < steps.length) {
        const step = steps[currentStep.value];
        currentPrayer.value = step.text;
        stepType.value = step.type;

        if (step.type === "anunciacaoMisterio") {
            const mysteryIndex = misterios.indexOf(step.text);
            if (mysteryIndex !== -1) {
                currentMystery.value = mysteryIndex;
            }
        }

        if (step.type === "aveMaria") {
            totalAveMarias.value = step.count;
        }
    } else {
        currentPrayer.value = "Terço concluído! Amém.";
        stepType.value = "end";
        focusMistery.value = 0;

        const lastPrayedDate = localStorage.getItem("lastPrayedDate");
        const today = new Date().toDateString();

        if (lastPrayedDate !== today) {
            const currentDays = parseInt(localStorage.getItem("days"), 10) || 0;
            const newDays = currentDays + 1;
            localStorage.setItem("days", newDays);
            localStorage.setItem("lastPrayedDate", today);
            daysPrayed.value = newDays;
        }
    }
};

onMounted(() => {
    const storedDays = localStorage.getItem("days");
    if (storedDays) {
        daysPrayed.value = parseInt(storedDays, 10);
    }
    focusMistery.value = 0;
});

function isQuarema() {
    const today = new Date();
    const year = today.getFullYear();
    const quaresmaStart = new Date(year, 2, 5);
    const quaresmaEnd = new Date(year, 3, 17);
    return today >= quaresmaStart && today <= quaresmaEnd;
}
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <Header :days-prayed="daysPrayed" @open-about="showAboutModal = true" />

        <main
            class="flex-1 flex flex-col justify-center items-center text-center"
        >
            <aside
                class="italic pb-5 transition-all"
                :class="{ 'transform translate-y-full opacity-0': started }"
                v-if="!started"
            >
                <p class="font-nightshade text-3xl lg:text-5xl text-dark-wine">
                    O Terço é a 'arma' para estes tempos.
                </p>
                <p class="opacity-50 text-sm">~São Padre Pio de Pietrelcina</p>
            </aside>

            <div
                ref="actualTerco"
                class="h-[55dvh] overflow-hidden flex items-center justify-center flex-col gap-3"
            >
                <div
                    v-for="value in 16"
                    :key="value"
                    :id="`bead-${value}`"
                    :class="{
                        'opacity-25 transition-all duration-700 ease-in-out':
                            started,
                        'scale-125 opacity-100': focusMistery == value,
                    }"
                >
                    <div
                        class="rounded-full bg-gray-900 text-white flex items-center justify-center"
                        :class="{
                            'w-6 h-6': !lagerMistery.includes(value),
                            'w-10 h-10': lagerMistery.includes(value),
                        }"
                    >
                        <span v-if="value === 12">
                            {{ currentMystery + 1 }}
                        </span>
                        <span v-else-if="value >= 2 && value <= 11">
                            {{ value - 1 }}
                        </span>
                    </div>
                </div>
                <img
                    ref="crucifixImage"
                    id="bead-17"
                    :class="{
                        'scale-125 transition-all duration-700 ease-in-out':
                            started,
                        'opacity-100': focusMistery === 17,
                        'opacity-25': started && focusMistery !== 17,
                    }"
                    width="175"
                    src="https://png.pngtree.com/png-vector/20240517/ourmid/pngtree-jesus-crucifix-narrative-composition-png-image_12474882.png"
                    alt="crucifixImage"
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
                        <span
                            v-if="
                                stepType === 'anunciacaoMisterio' &&
                                misteriosDoDia
                            "
                            class="block italic pb-2"
                        >
                            {{ misteriosDoDia[currentMystery] }}
                        </span>
                        <span>{{ currentPrayer }}</span>
                    </p>
                    <div class="flex md:flex-row gap-5 justify-end text-brown">
                        <button
                            v-if="stepType === 'aveMaria'"
                            @click="prayAveMaria"
                            type="button"
                            :disabled="!showButtons"
                            :class="{
                                'opacity-75 cursor-not-allowed': !showButtons,
                                'cursor-pointer': showButtons,
                            }"
                            class="w-full text-md md:text-xl md:w-75 font-playfair shadow-xl bg-light-brown font-black py-2 md:py-3 rounded-md"
                        >
                            <span v-if="showButtons"
                                >Ave Maria ({{ aveMariaCount }} /
                                {{ totalAveMarias }})</span
                            >
                            <span v-else>{{ countdown }}s</span>
                        </button>

                        <button
                            v-else
                            @click="nextStep"
                            type="button"
                            :disabled="!showButtons"
                            :class="{
                                'opacity-75 cursor-not-allowed': !showButtons,
                                'cursor-pointer': showButtons,
                            }"
                            class="w-full text-md md:text-xl md:w-75 font-playfair shadow-xl bg-light-brown font-black py-2 md:py-3 rounded-md"
                        >
                            <span v-if="showButtons">PROSSEGUIR</span>
                            <span v-else>{{ countdown }}s</span>
                        </button>
                    </div>
                </div>
            </aside>
        </footer>

        <About v-if="showAboutModal" @close="showAboutModal = false" />
    </div>
</template>
