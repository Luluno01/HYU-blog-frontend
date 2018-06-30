export function getScrollTop(): number {
  let scrollTop: number = 0, bodyScrollTop: number = 0, documentScrollTop: number = 0
  if(document.body) {
    bodyScrollTop = document.body.scrollTop
  }
  if(document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop
  }
  scrollTop = bodyScrollTop > documentScrollTop ? bodyScrollTop : documentScrollTop
  return scrollTop
}

export function getScrollHeight(): number {
  let scrollHeight: number = 0, bodyScrollHeight: number = 0, documentScrollHeight: number = 0
  if(document.body) {
    bodyScrollHeight = document.body.scrollHeight
  }
  if(document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight
  }
  scrollHeight = bodyScrollHeight > documentScrollHeight ? bodyScrollHeight : documentScrollHeight
  return scrollHeight
}

export function getWindowHeight(): number {
  let windowHeight: number = 0
  if(document.compatMode == 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight
  } else {
    windowHeight = document.body.clientHeight
  }
  return windowHeight
}

export default {
  get scrollTop(): number { return getScrollTop() },
  get scrollHeight(): number { return getScrollHeight() },
  get windowHeight(): number { return getWindowHeight() },
  get reachedBottom(): boolean { return getScrollTop() + getWindowHeight() == getScrollHeight() }
}