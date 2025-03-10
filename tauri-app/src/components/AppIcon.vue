<template>
	<component :is="icon" />
</template>

<script>
import {
	Archive,
	ArrowDownAZ,
	ArrowUpZA,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
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

export default {
	name: "AppIcon",
	props: {
		iconName: {
			type: String,
			required: true,
		},
	},
	computed: {
		icon() {
			const icons = {
				Archive,
				ArrowDownAZ,
				ArrowUpZA,
				Calendar,
				Check,
				ChevronDown,
				ChevronUp,
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
			return icons[this.iconName] || null;
		},
	},
};
</script>
