<script setup>

import NarBar from "@/components/navbar/NarBar.vue";
import {onMounted} from "vue";
import api from "@/js/http/api.js";
import {useUserStore} from "@/stores/user.js";
import {useRoute, useRouter} from "vue-router";

const user = useUserStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  try {
    const res = await api.get('/api/user/account/get_user_info/')
    const data = res.data
    if(data.result === 'success') {
      user.setUserInfo(data)
    }
  } catch(error) {
    console.log(error);
  } finally {
    user.SetHasPulledUserInfo(true)

    if(route.meta.needLogin && !user.isLogin()) {
      await router.replace({
        name: 'user-account-login-index'
      })
    }
  }
})

</script>

<template>
  <NarBar>
    <RouterView />
  </NarBar>
</template>

<style scoped>

</style>
