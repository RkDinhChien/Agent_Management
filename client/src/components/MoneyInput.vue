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
  modelValue: { type: [Number, String], default: 0 },
  placeholder: { type: String, default: '0' },
  disabled: { type: Boolean, default: false },
  inputClass: { type: [String, Object, Array], default: '' },
  suffix: { type: String, default: 'đ' },
});

const emit = defineEmits(['update:modelValue']);

const focused = ref(false);
const rawDisplay = ref('');

const toNumber = (value) => {
  const str = String(value ?? '').trim();
  if (!str) return 0;
  const allowed = str.replace(/[^0-9.,-]/g, '');
  let normalized = allowed;
  if (allowed.includes(',') && allowed.includes('.')) {
    normalized = allowed.replace(/\./g, '').replace(',', '.');
  } else if (allowed.includes('.') && (allowed.match(/\./g) || []).length > 1) {
    normalized = allowed.replace(/\./g, '');
  }
  normalized = normalized.replace(/,/g, '.');
  const result = Number(normalized);
  return Number.isNaN(result) ? 0 : result;
};

const fmt = (n) => toNumber(n).toLocaleString('vi-VN');

const displayValue = computed(() => {
  if (focused.value) return rawDisplay.value;
  return props.modelValue ? fmt(props.modelValue) : '';
});

watch(() => props.modelValue, (v) => {
  if (!focused.value) rawDisplay.value = v ? String(toNumber(v)) : '';
}, { immediate: true });

const onFocus = () => {
  focused.value = true;
  rawDisplay.value = props.modelValue ? String(toNumber(props.modelValue)) : '';
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
.money-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}
.money-input-wrap input {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 28px;
  font-variant-numeric: tabular-nums;
}
.money-input-wrap input.finp {
  height: 36px;
  padding: 0 12px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 13px;
  color: var(--c-txt);
  background: var(--c-bg);
  outline: none;
  transition: border-color .15s ease, background .15s ease;
}
..money-input-wrap input.money-finp {
  height: 36px;
  padding: 0 12px 0 38px;
  border: 1.5px solid rgba(148, 163, 184, .32);
  border-radius: 8px;
  font-size: 13px;
  color: var(--c-txt);
  background: #fff;
  outline: none;
  transition: border-color .15s ease, background .15s ease;
  text-align: right;
  box-shadow: inset 0 1px 0 rgba(15, 23, 42, .02), 0 1px 2px rgba(15, 23, 42, .03);
}
.money-input-wrap input.money-finp.money-finp-left {
  text-align: left;
}
.money-input-wrap input.finp:focus,
.money-input-wrap input.money-finp:focus {
  border-color: var(--c-primary);
  background: #fff;
}
.money-input-wrap input.money-finp:focus {
  background: #fff;
}
.money-suffix {
  position: absolute; right: 10px;
  font-size: 12px; font-weight: 600; color: #94a3b8; pointer-events: none;
}
</style>
