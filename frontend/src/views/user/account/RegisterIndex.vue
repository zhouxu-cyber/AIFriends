<script setup>
import {ref} from "vue";
import axios from "axios";
import api from "@/js/http/api.js";
import {useUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";

const username = ref('')
const password = ref('')
const ConfirmedPassword = ref('')
const errorMessage = ref('')

const user = useUserStore()
const router = useRouter()

async function handleRegister() {
  errorMessage.value = ''
  if(!username.value.trim()) {
    errorMessage.value = 'Username is empty!'
  } else if(!password.value.trim()) {
    errorMessage.value = 'Password is empty!'
  } else if(ConfirmedPassword.value.trim() !== password.value.trim()) {
    errorMessage.value = 'Confirmed Password is not match!'
  } else {
    try {
      const res = await api.post('/api/user/account/register/', {
        username: username.value,
        password: password.value,
      })
      const data = res.data
      if(data.result === 'success') {
        user.setAccessToken(data.access)
        user.setUserInfo(data)
        console.log(data)
        await router.push({
          name: 'user-account-login-index',
        })
      } else {
        errorMessage.value = data.result
      }
    } catch (error) {
      console.log(error)
    }
  }
}

</script>

<template>
  <div class="flex justify-center mt-40">
    <form @click.prevent="handleRegister" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <label class="label">用户名</label>
      <input v-model="username" type="text" class="input placeholder:text-gray-400" placeholder="Username" />

      <label class="label">密码</label>
      <input v-model="password" type="password" class="input placeholder:text-gray-400" placeholder="Password" />

      <label class="label">确认密码</label>
      <input v-model="ConfirmedPassword" type="password" class="input placeholder:text-gray-400" placeholder="ConfirmedPassword" />

      <p v-if="errorMessage" class="text-s text-red-500 mt-1">{{errorMessage}}</p>

      <button class="btn btn-neutral mt-4">注册</button>

      <div class="mt-3 text-right text-sm text-gray-500">
        <RouterLink
          :to="{ name: 'user-account-login-index' }"
          class="ml-1 text-gray-700 font-medium hover:text-blue-500"
        >
          登录
        </RouterLink>
      </div>

    </form>
  </div>

</template>

<style scoped>

</style>