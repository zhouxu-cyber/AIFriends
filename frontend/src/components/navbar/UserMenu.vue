<script setup>
import {useUserStore} from "@/stores/user.js";
import UserSpaceIcon from "@/components/navbar/icons/UserSpaceIcon.vue";
import UserProfileIcon from "@/components/navbar/icons/UserProfileIcon.vue";
import UserLogoutIcon from "@/components/navbar/icons/UserLogoutIcon.vue";
import api from "@/js/http/api.js";
import {useRouter} from "vue-router";

const user = useUserStore()
const router = useRouter()
function closeMenu() {
  const element = document.activeElement
  if (element && element instanceof HTMLElement) element.blur()
}

async function handleLogout(){
  try {
    const res = await api.post('/api/user/account/logout/')
    if(res.data.result === 'success') {
      user.logout()
      await router.push({
        name: 'homepage-index'
      })
    }
  } catch(error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="avatar btn btn-circle w-8 h-8 mr-6">
      <div class="w-8 rounded-full">
        <img :src="user.photo" alt="">
      </div>
    </div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-lg">
      <li v-if="user.id">
        <RouterLink @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}"
        class="hover:bg-gray-100 rounded-lg transition">
          <div class="avatar">
            <div class="w-10 rounded-full">
              <img :src="user.photo" alt="">
            </div>
          </div>
          <span class="text-base font-bold line-clamp-1" style="color:red">{{user.username}}</span>
        </RouterLink>
      </li>

      <li v-if="user.id">
        <RouterLink @click="closeMenu" :to="{name: 'user-space-index', params: {user_id: user.id}}" class="text-sm font-bold py-3
         hover:bg-gray-100 rounded-lg transition" >
          <UserSpaceIcon />
            个人空间
        </RouterLink>
      </li>

      <li>
        <RouterLink @click="closeMenu" :to="{name: 'user-profile-index'}" class="text-sm font-bold py-3
         hover:bg-gray-100 rounded-lg transition" >
          <UserProfileIcon />
            编辑资料
        </RouterLink>
      </li>
      <li>
         <hr class="my-1 border-gray-200">
      </li>  <!-- 分隔线 -->
      <li>
        <a @click="handleLogout" class="text-sm font-bold py-3 hover:bg-gray-100 rounded-lg transition cursor-pointer" >
          <UserLogoutIcon />
            退出
        </a>
      </li>

    </ul>
  </div>
</template>

<style scoped>

</style>