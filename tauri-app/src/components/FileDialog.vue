<template>
  <button @click="openFile">open</button>

</template>


<script>
import { open } from '@tauri-apps/plugin-dialog';
export default {
    name:"FileDialog",
    data(){
        return{}
    },
    methods:{
        async openFile() {
      const file = await open({
        multiple: false,
        directory: false,
      });
    },
    }
}

</script>