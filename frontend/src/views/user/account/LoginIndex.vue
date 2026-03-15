<script setup>
import {ref} from "vue";
import {useUserStore} from "@/stores/user.js";
import {useRouter} from "vue-router";
import api from "@/js/http/api.js";

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const user = useUserStore()
const router = useRouter() //实现跳转

async function handleLogin() {
  errorMessage.value = ' '
  if(!username.value.trim()) {
    errorMessage.value = 'Username is empty!'
  } else if(!password.value.trim()) {
    errorMessage.value = 'Password is empty!'
  } else {
    try {
      const res = await api.post('/api/user/account/login/', {
        username: username.value,
        password: password.value,
      })
      const data = res.data
      if(data.result === 'success') {
        user.setAccessToken(data.access)
        user.setUserInfo(data)
        console.log(data)
        await router.push({
          name: 'homepage-index'
        })
      } else {
        errorMessage.value = data.result
      }
    } catch(err) {
      console.log(err)
    }
  }
}
</script>

<template>
  <div class="flex justify-center mt-40">
    <form @submit.prevent="handleLogin" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <label class="label">用户名</label>
      <input v-model="username" type="text" class="input placeholder:text-gray-400" placeholder="Username" />

      <label class="label">密码</label>
      <input v-model="password" type="password" class="input placeholder:text-gray-400" placeholder="Password" />

      <p v-if="errorMessage" class="text-sm text-red-500 mt-1"> {{errorMessage}} </p>

      <button class="btn btn-neutral mt-4">登录</button>

      <div class="mt-3 text-right text-sm text-gray-500">
        <span>还没有账号？请</span>
        <RouterLink
          :to="{ name: 'user-account-register-index' }"
          class="ml-1 text-gray-700 font-medium hover:text-blue-500"
        >
          注册
        </RouterLink>
      </div>

    </form>
  </div>

</template>

<style scoped>

</style>