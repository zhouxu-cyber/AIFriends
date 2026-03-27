<script setup>
import {ref, useTemplateRef} from "vue";
import {useUserStore} from "@/stores/user.js";
import UpdateIcon from "@/components/navbar/icons/UpdateIcon.vue";
import RemoveIcon from "@/components/navbar/icons/RemoveIcon.vue";
import api from "@/js/http/api.js";
import ChatField from "@/components/character/chat_field/ChatField.vue";
import {useRouter} from "vue-router";

const props = defineProps(['character', 'canEdit', 'canRemoveFriend', 'friendId'])
const isHover = ref(false)
const user = useUserStore()
const emit = defineEmits(['remove'])
const deleteDialogRef = ref(null)
const router = useRouter()

const who = ref('')

function openDeleteDialog(e) {
  who.value = e
  deleteDialogRef.value?.showModal()
}

async function confirmRemoveCharacter(e) {
  try {
    e.stopPropagation()
    await handleRemoveCharacter()
    deleteDialogRef.value?.close()
  } catch (error) {
    console.log(error)
  }
}

async function confirmRemoveFriend(e) {
  try {
    e.stopPropagation()
    await handleRemoveFriend()
    deleteDialogRef.value?.close()
  } catch (error) {
    console.log(error)
  }
}

async function handleRemoveFriend() {
  try {
    const res = await api.post('/api/friend/remove/', {
      friend_id: props.friendId,
    })
    if (res.data.result === 'success') {
      emit('remove', props.friendId)
    }
  } catch (err) {
  }
}


async function handleRemoveCharacter() {
  try {
    const res = await api.post('/api/create/character/remove/', {
      character_id: props.character.id,
    })
    if(res.data.result === 'success') {
      emit('remove', props.character.id)
    }
  } catch(error) {
    console.error(error)
  }
}
const chatFieldRef = useTemplateRef('chat-field-ref')
const friend = ref(null)

async function openChatField() {
  if(!user.isLogin()) {
    await router.push({
      name: 'user-account-login-index'
    })
  } else {
    try{
      const res = await api.post('/api/friend/get_or_create/', {
          character_id: props.character.id,
      })
      const data = res.data

      if(data.result === 'success') {
        friend.value = data.friend
        chatFieldRef.value.showModal()
      }
    } catch(error) {
      console.error(error)
    }
  }
}

</script>

<template>
  <div>
    <div class="avatar cursor-pointer" @mouseover="isHover = true" @mouseout="isHover = false" @click="openChatField">
      <div class="w-60 h-100 rounded-2xl relative">
        <img :src="character.background_image" class="transistion-transform duration-500" :class="{'scale-120': isHover}" alt="">
        <div class="absolute left-0 top-50 w-60 h-50 bg-linear-to-t from-black/40 to-transparent"></div>
        <div v-if="canEdit && character.author.user_id === user.id" class="absolute right-0 top-50">
          <RouterLink @click.stop :to="{name: 'update-character', params: {character_id: character.id}}" class="btn btn-circle btn-ghost
           bg-transparent">
            <UpdateIcon />
          </RouterLink>
          <button
          @click="openDeleteDialog('character')" class="btn btn-circle btn-ghost bg-transparent">
          <RemoveIcon />
          </button>
        </div>

        <div v-if="canRemoveFriend" class="absolute right-0 top-50">
          <button @click.stop="openDeleteDialog('friend')" class="btn btn-circle btn-ghost bg-transparent">
            <RemoveIcon />
          </button>
        </div>
        <div class="absolute left-4 top-54 avatar">
          <div class="w-16 rounded-full ring-3 ring-white">
            <img :src="character.photo" alt="">
          </div>
        </div>
        <div class="absolute left-24 right-4 top-58 text-white font-bold line-clamp-1 break-all">
          {{ character.name }}
        </div>
        <div class="absolute left-4 right-4 top-72 text-white line-clamp-4 break-all">
          {{ character.profile }}
        </div>

      </div>

    </div>
    <RouterLink :to="{name: 'user-space-index', params: {user_id: character.author.user_id}}" class="flex items-center mt-4 gap-2 w-60">
      <div class="avatar">
        <div class="w-7 rounded-full">
          <img :src="character.author.photo" alt="">
        </div>
      </div>
      <div class="text-sm line-clamp-1 break-all">
        {{character.author.username}}
      </div>
    </RouterLink>
    <ChatField ref="chat-field-ref" :friend="friend" />

    <dialog ref="deleteDialogRef" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">确认删除</h3>
        <p class="py-4">删除后无法恢复，确定要删除这个角色吗？</p>

        <div class="modal-action">
          <form method="dialog">
            <button @click.stop class="btn">取消</button>
          </form>
          <button v-if="who==='character'" class="btn btn-error" @click.stop="confirmRemoveCharacter">
            确认删除
          </button>
          <button v-else class="btn btn-error" @click.stop="confirmRemoveFriend">
            确认删除
          </button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button @click.stop>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>

</style>