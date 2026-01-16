<template>
    <button>
        {{  }}
    </button>
</template>

<script lang="ts">
export default {
    name: "MainButton",

    props:{
        label:{
            type:String,
            default: "Button"
        }
    },

    emits: ['handleClick'],

    setup(props, {emit}){

    }
}
</script>

<style scoped></style>