/* 本地存储封装模块 */

// 获取数据
export const getItem = (name) => {
    const data = window.localStorage.getItem(name)

    try {
        // 将对象 转化为 字符串
        return JSON.parse(data)
    } catch (error) {
        // 错误就原样返回
        return data
    }
}

// 添加数据
export const setItem = (name, value) => {
    if (typeof value === 'object') {
        // 如果值是对象，将他转换为 json形式 的字符串 再存储
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
}

// 删除数据
export const removeItem = name => {
    window.localStorage.removeItem(name)
}