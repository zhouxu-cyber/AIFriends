<script setup>


import {nextTick, onBeforeUnmount, ref, useTemplateRef, watch} from "vue";
import CameraIcon from "@/components/navbar/icons/CameraIcon.vue";
import Croppie from "croppie"
import 'croppie/croppie.css'

const props = defineProps(['photo'])
const myPhoto = ref(props.photo)


watch(() => props.photo, newValue => {
  myPhoto.value = newValue;
})

const fileInputRef = useTemplateRef('file-input-ref')
const modalRef = useTemplateRef('modal-ref')
const croppieRef = useTemplateRef('croppie-ref')
let croppie = null

async function openModal(photo) {
  modalRef.value.showModal()
  await nextTick()

  if (!croppie) {
      croppie = new Croppie(croppieRef.value, {  // 创建croppie对象
      viewport: {width: 200, height: 200, type: 'square'},
      boundary: {width: 300, height: 300},
      enableOrientation: true,
      enforceBoundary: true,
    })
  }

  croppie.bind({
    url: photo
  })
}

async function crop() {
  if(!croppie)  return

  myPhoto.value = await croppie.result({
    type: 'base64',
    size: 'viewport',
  })

  modalRef.value.close()
}

function onFileChange(e) {
  const file = e.target.files[0]
  e.target.value = ''
  if(!file)   return

  const reader = new FileReader()
  reader.onload = () => {
    openModal(reader.result)
  }
  reader.readAsDataURL(file)
}

onBeforeUnmount(() => {
  croppie?.destroy()
})

defineExpose({
  myPhoto
})

</script>

<template>
  <div class="flex justify-center">
    <div class="avatar relative w-28 h-28">
      <div v-if="myPhoto" class="w-28 h-28 rounded-full overflow-hidden">
        <img :src="myPhoto" alt="" class="w-full h-full object-cover">
      </div>
      <div v-else class="w-28 h-28 rounded-full bg-base-200"></div>
      <div
        @click="fileInputRef.click()"
        class="w-28 h-28 rounded-full bg-black/5 flex justify-center items-center absolute top-0 left-0 cursor-pointer"
      >
        <CameraIcon class="opacity-50"  />
      </div>
    </div>
  </div>

  <input ref="file-input-ref" type="file" class="hidden" accept="image/*" @change="onFileChange">
  <dialog ref="modal-ref" class="modal">
    <div class="modal-box transition-none">
      <button @click="modalRef.close()" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">❌️</button>

      <div ref="croppie-ref" class="flex flex-col mv-4"></div>

      <div class="modal-action">
        <button @click="modalRef.close()" class="btn">取消</button>
        <button @click="crop" class="btn btn-neutral">确定</button>
      </div>

    </div>
  </dialog>
</template>

<style scoped>

</style>