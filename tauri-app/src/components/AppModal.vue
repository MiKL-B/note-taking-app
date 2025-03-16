<template>
  <div id="myModal" class="modal" v-if="isVisible">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="modal-footer" v-if="isConfirm">
        <button class="success" @click="confirm">{{ $t('yes') }}</button>
        <button class="danger" @click="cancel">{{ $t('no') }}</button>
      </div>
      <div class="modal-footer" v-else>
        <button class="success" @click="confirm">{{ $t('ok') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppModal",
  props: ["message", "isConfirm", "isVisible"],
  emits: ["confirmed","canceled","close"],
  methods: {
    confirm() {
      this.$emit('confirmed');
      this.$emit('close');
    },
    cancel() {
      this.$emit('canceled');
      this.$emit('close');
    }
  }
}
</script>
<style>
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.2);
}

.modal-content {
  background-color: var(--bg-body);
  color: var(--text-color-button);
  border: var(--border);
  border-radius: 5px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-footer {
  display: flex;
  gap: 0.2rem;
  justify-content: flex-end;
}
</style>