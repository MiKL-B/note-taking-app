<template>
  <div id="toolbar">
    <span class="bt-toolbar" @click="toggleSubMenu('file')">File</span>
    <div
      v-if="isSubMenuVisible.file"
      class="sub-menu"
      :style="{ top: '2rem', left: '0.5rem' }"
    >
      <div @click="onSubMenuClick('new')">New</div>
      <div @click="onSubMenuClick('open')">Open</div>
      <div @click="onSubMenuClick('save')">Save</div>
    </div>
    <span class="bt-toolbar" @click="toggleSubMenu('edit')">Edit</span>
    <div
      v-if="isSubMenuVisible.edit"
      class="sub-menu"
      :style="{ top: '2rem', left: '4.2rem' }"
    >
      <div @click="onSubMenuClick('undo')">Undo</div>
      <div @click="onSubMenuClick('redo')">Redo</div>
      <div @click="onSubMenuClick('cut')">Cut</div>
      <div @click="onSubMenuClick('copy')">Copy</div>
      <div @click="onSubMenuClick('paste')">Paste</div>
    </div>
    <span class="bt-toolbar" @click="toggleSubMenu('view')">View</span>
    <div
      v-if="isSubMenuVisible.view"
      class="sub-menu"
      :style="{ top: '2rem', left: '8rem' }"
    >
      <div @click="toggleNoteListVisibility">
        {{ isVisibleNoteList ? 'Hide notelist' : 'Show notelist' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data(){
    return{
      isSubMenuVisible: {
        file: false,
        edit: false,
        view: false,
      },
      isVisibleNoteList: true,
    }
  },
  methods: {
    toggleSubMenu(menu) {
      Object.keys(this.isSubMenuVisible).forEach((key) => {
        if (key !== menu) {
          this.isSubMenuVisible[key] = false;
        }
      });
      this.isSubMenuVisible[menu] = !this.isSubMenuVisible[menu];
    },
    onSubMenuClick(action) {
      this.$emit('action-clicked', action);
      this.resetSubMenus();
    },
    toggleNoteListVisibility() {
      this.isVisibleNoteList = !this.isVisibleNoteList;
      this.$emit('toggle-notelist', this.isVisibleNoteList);
    },
    resetSubMenus() {
      this.isSubMenuVisible = {
        file: false,
        edit: false,
        view: false,
      };
    },
  },
  mounted() {
    if (document.querySelector(".bt-toolbar")) {
      document.addEventListener("click", (event) => {
        // Vérifier si l'élément cliqué est '.bt-toolbar' ou s'il se trouve à l'intérieur
        const isToolbarClicked = event.target.closest(".bt-toolbar");

        // Si ce n'est pas '.bt-toolbar', exécutez la fonction resetSubMenus
        if (!isToolbarClicked) {
          this.resetSubMenus();
        }
      });
    }
  },
  beforeDestroy() {
    if (document.querySelector(".bt-toolbar")) {
      document.addEventListener("click", (event) => {
        // Vérifier si l'élément cliqué est '.bt-toolbar' ou s'il se trouve à l'intérieur
        const isToolbarClicked = event.target.closest(".bt-toolbar");

        // Si ce n'est pas '.bt-toolbar', exécutez la fonction resetSubMenus
        if (!isToolbarClicked) {
          this.resetSubMenus();
        }
      });
    }
  },
};
</script>
<style>
#toolbar {
  border-top: var(--border);
  border-bottom: var(--border);
  display: flex;
  padding-left: 0.5rem;
  gap: 1rem;
  position: relative;
}
.bt-toolbar {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem 0;
  border-radius: 5px;
  user-select: none;
}
.bt-toolbar:hover {
  background: #f4f4f5;
  cursor: pointer;
}


.sub-menu {
  background-color: white; /* Couleur de fond des sous-menus */
  position: absolute; /* Positionnement absolu pour le sous-menu */
  z-index: 1; /* Placer le sous-menu au-dessus */
  margin-top: 5px; /* Espacement au-dessus du sous-menu */
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 200px;
}

.sub-menu div {
  padding: 0.2rem 0.5rem;
  margin: 0.2rem;
  border-radius: 5px;
  cursor: pointer; /* Changer le curseur en pointeur */
}

.sub-menu div:hover {
  background-color: #f4f4f5; /* Couleur sur survol */
}
</style>
