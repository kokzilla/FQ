export default defineNuxtRouteMiddleware((to) => {
  // ยกเว้นหน้า login ไม่ต้องดักจับ
  if (to.path === '/login') {
    return
  }

  // ตรวจสอบคุกกี้เซสชันของผู้ใช้
  const userSession = useCookie<any>('bru_user_session')

  if (!userSession.value || !userSession.value.userlogin) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // ป้องกันการเข้าถึงหน้า /admin สำหรับผู้ใช้ที่ไม่ได้มีสิทธิ์ ADMIN
  if (to.path.startsWith('/admin') && userSession.value.role !== 'ADMIN') {
    return navigateTo('/')
  }
})
