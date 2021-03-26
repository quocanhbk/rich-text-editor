// class Color {
//     constructor (init = "#000000") {
//         this.value = this.getArray(init);
//     }
//     getArray = (init) => {
//         let arr = [init.slice(1, 3), init.slice(3, 5), init.slice(5, 7)]
//         let clr = [0,0,0]
//         // for (x in arr)
//         //     x = this.translate(arr[x])
//         arr.forEach((x, y) => {
//             for (let i = 0; i < 2; i++) {
//                 let v = x[i] === 'A' ? 10 : 
//                         x[i] === 'B' ? 11 : 
//                         x[i] === 'C' ? 12 : 
//                         x[i] === 'D' ? 13 : 
//                         x[i] === 'E' ? 14 : 
//                         x[i] === 'F' ? 15 : 
//                         parseInt(x[i])
//                 clr[y] += v * 16**(1 - i)
//             }
//         });
//         return clr
//     }
//     getColor = () => 'RGB(' + this.value[0] + ', ' + this.value[1] + ', ' + this.value[2] + ')'

//     getDarker = (shade = 20) => {
//         let shadeClr = parseInt(255 * shade/100)
//         let newClr = this.value.map(x => parseInt(Math.max(x - shadeClr, 0)))
//         return 'RGB(' + newClr[0] + ', ' + newClr[1] + ', ' + newClr[2] + ')'
//     }
//     getLighter = (shade = 20) => {
//         let shadeClr = parseInt(255 * shade/100)
//         let newClr = this.value.map(x => parseInt(Math.min(x + shadeClr, 255)))
//         return 'RGB(' + newClr[0] + ', ' + newClr[1] + ', ' + newClr[2] + ')'
//     }
// }
// export default Color

export const getDarker = (hex, shade = 20) => {
    let arr = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    let clr = [0,0,0]
    arr.forEach((x, y) => {
        for (let i = 0; i < 2; i++) {
            let v = x[i] === 'A' ? 10 : x[i] === 'B' ? 11 : x[i] === 'C' ? 12 : x[i] === 'D' ? 13 : x[i] === 'E' ? 14 : x[i] === 'F' ? 15 : parseInt(x[i])
            clr[y] += v * 16**(1 - i)
        }
    });
    
    let shadeClr = parseInt(255 * shade/100)
    let newClr = clr.map(x => parseInt(Math.max(x - shadeClr, 0)))
    return 'RGB(' + newClr[0] + ', ' + newClr[1] + ', ' + newClr[2] + ')'
}

export const getLighter = (hex, shade = 20) => {
    let arr = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    let clr = [0,0,0]
    arr.forEach((x, y) => {
        for (let i = 0; i < 2; i++) {
            let v = x[i] === 'A' ? 10 : x[i] === 'B' ? 11 : x[i] === 'C' ? 12 : x[i] === 'D' ? 13 : x[i] === 'E' ? 14 : x[i] === 'F' ? 15 : parseInt(x[i])
            clr[y] += v * 16**(1 - i)
        }
    });

    let shadeClr = parseInt(255 * shade/100)
    let newClr = clr.map(x => parseInt(Math.min(x + shadeClr, 255)))
    return 'RGB(' + newClr[0] + ', ' + newClr[1] + ', ' + newClr[2] + ')'
}
export const getFader = (hex, opa = 0.2) => {
    let arr = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
    let clr = [0,0,0]
    arr.forEach((x, y) => {
        for (let i = 0; i < 2; i++) {
            let v = x[i] === 'A' ? 10 : x[i] === 'B' ? 11 : x[i] === 'C' ? 12 : x[i] === 'D' ? 13 : x[i] === 'E' ? 14 : x[i] === 'F' ? 15 : parseInt(x[i])
            clr[y] += v * 16**(1 - i)
        }
    });
    return 'RGBA(' + clr[0] + ', ' + clr[1] + ', ' + clr[2] + ', ' + opa + ')'
}
