<template>
  <div id="modal" v-if="isVisible">
    <div class="modal_content">
      <p>{{ message }}</p>
      <div class="modal_footer" v-if="isModalConfirm">
        <button class="success" @click="confirm">{{ $t('yes') }}</button>
        <button class="danger" @click="cancel">{{ $t('no') }}</button>
      </div>
      <div class="modal_footer" v-else>
        <button class="success" @click="confirm">{{ $t('ok') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  message:{
    type: String,
    default:"",
    required:true,
  },
  isModalConfirm:{
    type:Boolean,
    default:false,
    required:true,
  },
  isVisible:{
    type:Boolean,
    default:false,
    required:true,
  }
})
const emit = defineEmits(['confirmed','canceled','close'])
const confirm = ()=>{
  emit('confirmed')
  emit('close')
}
const cancel = () =>{
  emit('canceled')
  emit('close')
}

</script>
<style>
#modal {
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

.modal_content {
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

.modal_footer {
  display: flex;
  gap: 0.2rem;
  justify-content: flex-end;
}
</style>