import { pages, subPackages, tabBar } from '@/pages.json'
const getLastPage = () => {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包回报错，所以改用下面这个【虽然我加了src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/** 判断当前页面是否是tabbar页  */
export const getIsTabbar = () => {
  if (!tabBar) {
    return false
  }
  if (!tabBar.list.length) {
    // 通常有tabBar的话，list不能有空，且至少有2个元素，这里其实不用处理
    return false
  }
  const lastPage = getLastPage()
  const currPath = lastPage.route
  return !!tabBar.list.find((e) => e.pagePath === currPath)
}

/**
 * 获取当前页面路由的 path 路径和 redirectPath 路径
 * path 如 ‘/pages/login/index’
 * redirectPath 如 ‘/pages/demo/base/route-interceptor’
 */
export const currRoute = () => {
  const lastPage = getLastPage()
  const currRoute = (lastPage as any).$page
  // console.log('lastPage.$page:', currRoute)
  // console.log('lastPage.$page.fullpath:', currRoute.fullPath)
  // console.log('lastPage.$page.options:', currRoute.options)
  // console.log('lastPage.options:', (lastPage as any).options)
  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute as { fullPath: string }
  // console.log(fullPath)
  // eg: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor (小程序)
  // eg: /pages/login/index?redirect=%2Fpages%2Froute-interceptor%2Findex%3Fname%3Dfeige%26age%3D30(h5)
  return getUrlObj(fullPath)
}

const ensureDecodeURIComponent = (url: string) => {
  if (url.startsWith('%')) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/index?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/index, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export const getUrlObj = (url: string) => {
  const [path, queryStr] = url.split('?')
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {},
    }
  }
  const query: Record<string, string> = {}
  queryStr.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}
/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 这里设计得通用一点，可以传递key作为判断依据，默认是 needLogin, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的pages，如果传递了 key, 则表示通过 key 过滤
 */
export const getAllPages = (key = 'needLogin') => {
  // 这里处理主包
  const mainPages = [
    ...pages
      .filter((page) => !key || page[key])
      .map((page) => ({
        ...page,
        path: `/${page.path}`,
      })),
  ]
  // 这里处理分包
  const subPages: any[] = []
  subPackages.forEach((subPageObj) => {
    // console.log(subPageObj)
    const { root } = subPageObj

    subPageObj.pages
      .filter((page) => !key || page[key])
      .forEach((page: { path: string } & Record<string, any>) => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`,
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const getNeedLoginPages = (): string[] => getAllPages('needLogin').map((page) => page.path)

/**
 * 得到所有的需要登录的pages，包括主包和分包的
 * 只得到 path 数组
 */
export const needLoginPages: string[] = getAllPages('needLogin').map((page) => page.path)

/**
 * 剩余时间格式化
 * @param {number} t - 剩余多少秒
 * @return {object}  format - 格式后的天时分秒对象
 */
export function timeMuch(t: number) {
  const format: any = {
    d: '00',
    h: '00',
    m: '00',
    s: '00',
  }
  if (t > 0) {
    const d = Math.floor(t / 86400)
    const h = Math.floor((t / 3600) % 24)
    const m = Math.floor((t / 60) % 60)
    const s = Math.floor(t % 60)
    format.d = d < 10 ? `0${d}` : d
    format.h = h < 10 ? `0${h}` : h
    format.m = m < 10 ? `0${m}` : m
    format.s = s < 10 ? `0${s}` : s
  }
  return format
}
// 获取时间距离当前时间
export function getDateToNewData(timestamp: number | string | Date = new Date().getTime()) {
  if (typeof timestamp === 'string') timestamp = new Date(timestamp).getTime()

  // 补全为13位
  const arrTimestamp: Array<string> = `${timestamp}`.split('')
  for (let start = 0; start < 13; start++) {
    if (!arrTimestamp[start]) arrTimestamp[start] = '0'
  }
  timestamp = Number(arrTimestamp.join('')) * 1

  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const now = new Date().getTime()
  const diffValue = now - timestamp

  // 如果本地时间反而小于变量时间
  if (diffValue < 0) return '不久前'

  // 计算差异时间的量级
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute

  // 数值补0方法
  const zero = function (value: number) {
    if (value < 10) return `0${value}`

    return value
  }

  // 使用
  if (monthC > 12) {
    // 超过1年，直接显示年月日
    return (function () {
      const date = new Date(timestamp)
      return `${date.getFullYear()}年${zero(date.getMonth() + 1)}月${zero(date.getDate())}日`
    })()
  } else if (monthC >= 1) {
    return `${Number.parseInt(`${monthC}`)}月前`
  } else if (weekC >= 1) {
    return `${Number.parseInt(`${weekC}`)}周前`
  } else if (dayC >= 1) {
    return `${Number.parseInt(`${dayC}`)}天前`
  } else if (hourC >= 1) {
    return `${Number.parseInt(`${hourC}`)}小时前`
  } else if (minC >= 1) {
    return `${Number.parseInt(`${minC}`)}分钟前`
  }
  return '刚刚'
}

/**
 * 打电话
 * @param {string<number>} phoneNumber - 数字字符串
 * @return {Promise}
 */
export function callPhone(phoneNumber = '') {
  const num = phoneNumber.toString()
  return new Promise((resolve, reject) => {
    uni.makePhoneCall({
      phoneNumber: num,
      success: () => resolve(true),
      fail: (err) => reject(err),
    })
  })
}

/**
 * 调起客户端相机扫码。
 * @param {boolean} onlyFromCamera true 是否只允许相机扫码识别
 * @param {Array<string>} scanType ['barCode', 'qrCode', 'datamatrix','datamatrix']
 * @returns Promise 成功返回相关数据结构
 */
export function scanCode(
  onlyFromCamera = true,
  scanType = ['barCode', 'qrCode', 'datamatrix', 'datamatrix'],
): Promise<string | UniApp.ScanCodeSuccessRes> {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    reject(new Error('不支持H5'))
    // #endif
    // #ifndef H5
    uni.scanCode({
      onlyFromCamera,
      scanType,
      success: (res) => resolve(res),
      fail: (error) => reject(error),
    })
    // #endif
  })
}

type openUrlType = 'navigate' | 'redirect' | 'reLaunch' | 'switchTab' | 'navigateBack'
/**
 *
 * @param url string 打开的页面路径
 * @param type openUrlType "navigate"|"redirect"|"reLaunch"|"switchTab"|"navigateBack"
 */
export function routerTo(url: string, type: openUrlType = 'navigate') {
  const funType = {
    navigate: 'navigateTo',
    redirect: 'redirectTo',
    switchTab: 'switchTab',
    reLaunch: 'reLaunch',
    navigateBack: 'navigateBack',
  }
  const fun = funType[type]
  if (fun === 'navigateBack') {
    uni.navigateBack({
      fail(error) {
        console.error(error)
      },
    })
  } else if (fun === 'reLaunch') {
    uni.reLaunch({
      url,
      fail(error) {
        console.error(error)
      },
    })
  } else if (fun === 'switchTab') {
    uni.switchTab({
      url,
      fail(error) {
        console.error(error)
      },
    })
  } else if (fun === 'redirectTo') {
    uni.redirectTo({
      url,
      fail(error) {
        console.error(error)
      },
    })
  } else if (fun === 'navigateTo') {
    uni.navigateTo({
      url,
      fail(error) {
        console.error(error)
      },
    })
  }
}
