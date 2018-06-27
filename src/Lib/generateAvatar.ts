import vcolors from 'vuetify/es5/util/colors'
import md5 from 'crypto-js/md5'


let _colors = Object.keys(vcolors)
_colors.splice(_colors.indexOf('shade'), 1)
const colors = _colors


// Initialize
let canvas: HTMLCanvasElement = document.createElement('canvas')

canvas.setAttribute('height', '256')
canvas.setAttribute('width', '256')

let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

export function getText(str: string, color: string = 'black', background: string = 'gray'): string {
  if(ctx) {
    ctx.clearRect(0, 0, 256, 256)
    ctx.fillStyle = background
    // ctx.fillRect(0, 0, 256, 256)
    ctx.beginPath()
    ctx.arc(128, 128, 128, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = color
    ctx.font = '150px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(str, 128, 128)
  } else {
    console.error('Cannot get context')
  }
  return canvas.toDataURL()
}

export default function generateAvatar(userName: string, userId: string | number) {
  let str: string = userName + userId
  let hash: number = (parseInt(md5(str).toString().slice(26, 33), 16)) % colors.length
  return getText(
    userName && userName[0] || require('@/assets/logo.png'),
    (vcolors as any)[colors[hash]].darken2,
    (vcolors as any)[colors[hash]].lighten2
  )
}