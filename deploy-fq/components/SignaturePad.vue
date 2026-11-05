<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <label class="block text-xs font-medium text-slate-700">ลายมือชื่อผู้ประเมิน (ลงนามด้วยนิ้วหรือปากกา)</label>
      <button
        type="button"
        @click="clearSignature"
        class="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-0.5 rounded hover:bg-rose-50"
      >
        ล้างลายเซ็น
      </button>
    </div>

    <div class="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-inner">
      <canvas
        ref="canvasRef"
        class="w-full h-32 touch-none cursor-crosshair bg-slate-50/50"
        @pointerdown="startDrawing"
        @pointermove="draw"
        @pointerup="stopDrawing"
        @pointerleave="stopDrawing"
      ></canvas>
    </div>
    <p class="text-[11px] text-slate-400 text-right">สัมผัสและลากเส้นเพื่อลงลายมือชื่อ</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false

function restoreSignatureFromValue(dataUrl?: string | null) {
  const canvas = canvasRef.value
  if (!canvas || !ctx || !dataUrl) return
  const rect = canvas.getBoundingClientRect()
  const img = new Image()
  img.onload = () => {
    ctx?.clearRect(0, 0, rect.width, rect.height)
    ctx?.drawImage(img, 0, 0, rect.width, rect.height)
  }
  img.src = dataUrl
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  // Set display size
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * 2
  canvas.height = rect.height * 2

  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2.5
  }

  if (props.modelValue) {
    restoreSignatureFromValue(props.modelValue)
  }
})

watch(() => props.modelValue, (newVal) => {
  if (!isDrawing && newVal) {
    restoreSignatureFromValue(newVal)
  } else if (!newVal && canvasRef.value && ctx) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
})

function getCanvasCoordinates(e: PointerEvent) {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function startDrawing(e: PointerEvent) {
  isDrawing = true
  const { x, y } = getCanvasCoordinates(e)
  ctx?.beginPath()
  ctx?.moveTo(x, y)
}

function draw(e: PointerEvent) {
  if (!isDrawing || !ctx) return
  const { x, y } = getCanvasCoordinates(e)
  ctx.lineTo(x, y)
  ctx.stroke()
}

function stopDrawing() {
  if (!isDrawing) return
  isDrawing = false
  if (canvasRef.value) {
    const dataUrl = canvasRef.value.toDataURL('image/png')
    emit('update:modelValue', dataUrl)
  }
}

function clearSignature() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  emit('update:modelValue', '')
}
</script>
