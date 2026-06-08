<template>
  <div
    v-if="visible"
    class="card-shell"
    :class="{ 'is-hovered': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    ref="shellRef"
  >
    <!-- Action overlay — appears on hover -->
    <transition name="actions-fade">
      <div class="shell-actions" v-if="hovered">
        <button
          class="shell-btn capture-btn"
          title="Chụp ảnh thẻ"
          @click.stop="captureCard"
          :disabled="capturing"
        >
          <Camera :size="12" />
        </button>
        <button
          class="shell-btn delete-btn"
          title="Ẩn thẻ này"
          @click.stop="removeCard"
        >
          <X :size="12" />
        </button>
      </div>
    </transition>

    <!-- Card content slot -->
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Camera, X } from 'lucide-vue-next';
import html2canvas from 'html2canvas';

const props = defineProps({
  cardId: { type: String, required: true },
});
const emit = defineEmits(['remove']);

const shellRef = ref(null);
const hovered = ref(false);
const visible = ref(true);
const capturing = ref(false);

const removeCard = () => {
  visible.value = false;
  emit('remove', props.cardId);
};

const captureCard = async () => {
  if (!shellRef.value || capturing.value) return;
  capturing.value = true;
  hovered.value = false; // hide overlay before capture

  await new Promise(r => setTimeout(r, 80)); // let overlay fade out

  try {
    const canvas = await html2canvas(shellRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `the-${props.cardId}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    capturing.value = false;
    hovered.value = true;
  }
};
</script>

<style scoped>
.card-shell {
  position: relative;
  transition: box-shadow 0.18s ease, transform 0.18s ease;
}

/* subtle lift on hover — same feel as original .card-box:hover */
.card-shell.is-hovered {
  z-index: 10;
}

/* Action icons — top-right corner of the card */
.shell-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: all;
}

.shell-btn {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: opacity 0.12s ease, background 0.12s ease;
  padding: 0;
}

.shell-btn:disabled { opacity: 0.4; cursor: wait; }

.capture-btn {
  background: rgba(15, 23, 42, 0.12);
  color: rgba(15, 23, 42, 0.45);
}
.capture-btn:hover:not(:disabled) {
  background: rgba(15, 23, 42, 0.22);
  color: rgba(15, 23, 42, 0.8);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: rgba(239, 68, 68, 0.45);
}
.delete-btn:hover {
  background: rgba(239, 68, 68, 0.18);
  color: rgba(239, 68, 68, 0.85);
}

/* Fade transition */
.actions-fade-enter-active,
.actions-fade-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.actions-fade-enter-from,
.actions-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
