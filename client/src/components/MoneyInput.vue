<template>
  <div class="money-input-wrap">
    <input
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span v-if="suffix" class="money-suffix">{{ suffix }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  placeholder: { type: String, default: '0' },
  disabled: { type: Boolean, default: false },
  inputClass: { type: [String, Object, Array], default: '' },
  suffix: { type: String, default: 'đ' },
});

const emit = defineEmits(['update:modelValue']);

const focused = ref(false);
const rawDisplay = ref('');

const fmt = (n) => (n || 0).toLocaleString('vi-VN');

const displayValue = computed(() => {
  if (focused.value) return rawDisplay.value;
  return props.modelValue ? fmt(props.modelValue) : '';
});

watch(() => props.modelValue, (v) => {
  if (!focused.value) rawDisplay.value = v ? String(v) : '';
}, { immediate: true });

const onFocus = () => {
  focused.value = true;
  rawDisplay.value = props.modelValue ? String(props.modelValue) : '';
};

const onInput = (e) => {
  const digits = e.target.value.replace(/\D/g, '').replace(/^0+(\d)/, '$1');
  rawDisplay.value = digits;
  e.target.value = digits;
  emit('update:modelValue', digits ? parseInt(digits, 10) : 0);
};

const onBlur = () => {
  focused.value = false;
};
</script>

<style scoped>
.money-input-wrap { position: relative; display: flex; align-items: center; }
.money-input-wrap input { flex: 1; padding-right: 28px; }
.money-suffix {
  position: absolute; right: 10px;
  font-size: 12px; font-weight: 600; color: #94a3b8; pointer-events: none;
}
</style>
