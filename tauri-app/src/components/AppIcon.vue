<template>
	<component :is="icon" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
	Archive,
	ArrowDownAZ,
	ArrowUpZA,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	ChevronRight,
	CircleCheck,
	Columns2,
	CopyPlus,
	Eye,
	EyeOff,
	File,
	FileWarning,
	Filter,
	FilterX,
	Folder,
	Info,
	Lock,
	Minus,
	Pin,
	PinOff,
	Plus,
	RotateCcw,
	Square,
	Tag,
	Tags,
	Trash2,
	TriangleAlert,
	X,
} from "lucide-vue-next";
const props = defineProps({
	iconName: {
		type: String,
		default:"",
		required: true,
	},
})
const icon = computed(() => {
	const icons = {
		Archive,
		ArrowDownAZ,
		ArrowUpZA,
		Calendar,
		Check,
		ChevronDown,
		ChevronUp,
		ChevronRight,
		CircleCheck,
		Columns2,
		CopyPlus,
		Eye,
		EyeOff,
		File,
		FileWarning,
		Filter,
		FilterX,
		Folder,
		Info,
		Lock,
		Minus,
		Pin,
		PinOff,
		Plus,
		RotateCcw,
		Square,
		Tag,
		Tags,
		Trash2,
		TriangleAlert,
		X,
	};
	return icons[props.iconName] || null;
})
</script>
<style>
.size-20{
	width:20px;
}</style>