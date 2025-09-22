<script setup>
import { ref, onMounted } from "vue";

import TercoComun from "./assets/json/terco_comum.json";
import TercoQuaresma from "./assets/json/terco_quaresma.json";

import Header from "./components/Header.vue";
import About from "./components/ui/modal/About.vue";
import Style from "./components/ui/modal/Style.vue";

const crucifixImage = ref(null);
const focusMistery = ref(0);
const hideInitialBeads = ref(false);

const started = ref(false);
const ended = ref(false);
const showButtons = ref(false);
const countdown = ref(3);

const showAboutModal = ref(false);
const showStyleModal = ref(false);

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

const interactionSeq = ref([]);
const pointer = ref(0);
const stepsRef = ref([]);

const currentTheme = ref("theme-brown");
const handleChangeTheme = (theme) => {
    currentTheme.value = `theme-${theme}`;
    localStorage.setItem("terco-theme", currentTheme.value);
    showStyleModal.value = false;
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

function buildInteractionSequence(steps) {
    const seq = [];
    let context = "initial";
    let mysteryCount = -1;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        switch (step.type) {
            case "inicio":
                seq.push({ stepIndex: i, bead: 17 });
                break;
            case "creio":
                seq.push({ stepIndex: i, bead: 16 });
                break;
            case "paiNosso":
                if (context === "mystery") {
                    seq.push({ stepIndex: i, bead: 12 });
                } else {
                    seq.push({ stepIndex: i, bead: 16 });
                }
                break;
            case "aveMaria":
                if (step.count === 3) {
                    seq.push({ stepIndex: i, bead: 15 });
                    seq.push({ stepIndex: i, bead: 14 });
                    seq.push({ stepIndex: i, bead: 13 });
                } else if (step.count === 10) {
                    for (let b = 11; b >= 2; b--) {
                        seq.push({ stepIndex: i, bead: b });
                    }
                } else {
                    let start = Math.min(11, 11);
                    for (let k = 0; k < step.count; k++) {
                        seq.push({ stepIndex: i, bead: start - k });
                    }
                }
                break;
            case "gloria":
                if (context === "initial") {
                    seq.push({ stepIndex: i, bead: 13 });
                } else {
                    seq.push({ stepIndex: i, bead: 12 });
                }
                break;
            case "anunciacaoMisterio":
                context = "mystery";
                mysteryCount++;
                seq.push({ stepIndex: i, bead: 12 });
                break;
            case "salveRainha":
                seq.push({ stepIndex: i, bead: 1 });
                break;
            default:
                seq.push({ stepIndex: i, bead: 16 });
        }
    }

    return seq;
}

function setStateFromPointer() {
    const seq = interactionSeq.value;
    const steps = stepsRef.value;

    if (!seq || seq.length === 0) return;

    if (pointer.value >= seq.length) {
        currentPrayer.value = "Terço concluído! Amém.";
        stepType.value = "end";
        focusMistery.value = 0;
        ended.value = true;

        const lastPrayedDate = localStorage.getItem("lastPrayedDate");
        const today = new Date().toDateString();

        if (lastPrayedDate !== today) {
            const currentDays = parseInt(localStorage.getItem("days"), 10) || 0;
            const newDays = currentDays + 1;
            localStorage.setItem("days", newDays);
            localStorage.setItem("lastPrayedDate", today);
            daysPrayed.value = newDays;
        }
        return;
    }

    const item = seq[pointer.value];
    focusMistery.value = item.bead;

    currentStep.value = item.stepIndex;
    const step = steps[currentStep.value];
    currentPrayer.value = step.text;
    stepType.value = step.type;

    let mIndex = -1;
    for (let i = 0; i <= currentStep.value; i++) {
        if (steps[i].type === "anunciacaoMisterio") mIndex++;
    }
    currentMystery.value = Math.max(0, mIndex);

    if (step.type === "anunciacaoMisterio" && currentMystery.value === 0) {
        hideInitialBeads.value = true;
    }

    if (step.type === "aveMaria") {
        totalAveMarias.value = step.count || 0;
        let completed = 0;
        for (let i = 0; i < pointer.value; i++) {
            if (seq[i].stepIndex === currentStep.value) completed++;
        }
        aveMariaCount.value = completed;
    } else {
        totalAveMarias.value = 0;
        aveMariaCount.value = 0;
    }

    scrollToBead();
}

const startPray = () => {
    started.value = true;
    showButtons.value = false;
    countdown.value = 3;
    hideInitialBeads.value = false;

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

    const steps = getSteps(oracoesDoDia.value, misteriosDoDia.value);
    stepsRef.value = steps;
    interactionSeq.value = buildInteractionSequence(stepsRef.value);

    pointer.value = 0;
    setStateFromPointer();

    startCountdown();

    scrollToBead();
};

function nextStep() {
    pointer.value++;
    setStateFromPointer();

    startCountdown();
}

function prayAveMaria() {
    pointer.value++;
    setStateFromPointer();
}

function scrollToBead() {
    const focusedBead = document.getElementById(`bead-${focusMistery.value}`);
    if (focusedBead) {
        focusedBead.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
}

function startCountdown() {
    showButtons.value = false;
    countdown.value = 3;
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            clearInterval(timer);
            showButtons.value = true;
        }
    }, 1000);
}

onMounted(() => {
    const storedTheme = localStorage.getItem("terco-theme");
    if (storedTheme) {
        currentTheme.value = storedTheme;
    }

    const storedDays = localStorage.getItem("days");
    if (storedDays) {
        daysPrayed.value = parseInt(storedDays, 10);
    }
    focusMistery.value = 0;

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            if (!started.value) {
                startPray();
            } else if (showButtons.value && !ended.value) {
                if (stepType.value === "aveMaria") {
                    prayAveMaria();
                } else {
                    nextStep();
                }
            }
        }
    });
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
    <div class="flex flex-col min-h-screen" :class="currentTheme">
        <Header
            :days-prayed="daysPrayed"
            @open-about="showAboutModal = true"
            @open-style="showStyleModal = true"
        />

        <main
            class="flex-1 flex flex-col justify-center items-center text-center"
        >
            <transition
                enter-active-class="transition duration-700 ease-out"
                enter-from-class="opacity-0 scale-75 translate-y-5"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition duration-700 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-90 -translate-y-5"
            >
                <aside v-if="!started" class="italic pb-5">
                    <p
                        class="font-nightshade text-3xl lg:text-5xl text-dark-wine"
                    >
                        O Terço é a 'arma' para estes tempos.
                    </p>
                    <p class="opacity-50 text-sm">
                        ~São Padre Pio de Pietrelcina
                    </p>
                </aside>
            </transition>

            <div
                ref="actualTerco"
                class="h-[55dvh] w-full overflow-hidden flex items-center justify-center flex-col gap-3"
            >
                <div
                    v-for="value in 16"
                    :key="value"
                    :id="`bead-${value}`"
                    :class="{
                        'opacity-25 transition-all duration-700 ease-in-out':
                            started,
                        hidden: hideInitialBeads && value > 12,
                        'scale-125 opacity-100': focusMistery == value,
                    }"
                >
                    <div
                        class="rounded-full bg-gray-900 text-white flex items-center justify-center transition-transform duration-700"
                        :class="{
                            'w-6 h-6 shadow-md': !lagerMistery.includes(value),
                            'w-10 h-10 shadow-xl': lagerMistery.includes(value),
                        }"
                    >
                        <span v-if="value === 12 || value === 1">
                            {{
                                value === 12
                                    ? currentMystery + 1
                                    : currentMystery + 2 != 6
                                    ? currentMystery + 2
                                    : ""
                            }}
                        </span>
                        <small v-else-if="value >= 2 && value <= 11">
                            {{ value - 1 }}
                        </small>
                    </div>
                </div>

                <transition
                    enter-active-class="transition duration-700 ease-out"
                    enter-from-class="opacity-0 scale-75 translate-y-5"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-700 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-90 -translate-y-5"
                >
                    <img
                        v-if="!hideInitialBeads"
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
                </transition>
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
                    class="w-full lg:w-[50%] leading-7 text-4xl flex items-center flex-col font-playfair shadow-xl bg-brown cursor-pointer text-white font-black py-3 md:pt-3 md:pb-2 rounded-md"
                >
                    COMEÇAR
                    <small class="text-sm hidden md:block">press space</small>
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
                            {{ currentMystery + 1 }}º Misterio
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
                                >Ave Maria ({{ aveMariaCount + 1 }} /
                                {{ totalAveMarias }})</span
                            >
                            <span v-else>{{ countdown }}s</span>
                        </button>

                        <button
                            v-else
                            @click="nextStep"
                            type="button"
                            :disabled="!showButtons"
                            v-if="!ended"
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
        <Style
            v-if="showStyleModal"
            @close="showStyleModal = false"
            @change-theme="handleChangeTheme"
        />
    </div>
</template>
