<template>
  <div class="min-h-screen font-sans bg-slate-50 text-slate-900">
    <VitePwaManifest />
    <ImpersonationBanner />
    <NuxtPage />
    <ClientOnly>
      <PwaInstallPrompt />
      <PwaUpdatePrompt />
    </ClientOnly>
  </div>
</template>
