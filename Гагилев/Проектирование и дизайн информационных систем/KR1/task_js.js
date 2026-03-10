export const calc = {
    lastResult: 0,
    history: [],

    add(a, b) {
        if (b === undefined) {
            b = a
            a = this.lastResult
        } else {
            this.lastResult = 0
            this.clear()
        }
        let res = a + b
        this.lastResult = res
        this.history.push({
            a: a,
            opr: "+",
            b: b,
            res: this.lastResult
        })
    },

    sub(a, b) {
        if (b === undefined) {
            b = a
            a = this.lastResult
        } else {
            this.lastResult = 0
            this.clear()
        }
        let res = a - b
        this.lastResult = res
        this.history.push({
            a: a,
            opr: "-", 
            b: b,
            res: this.lastResult
        })
    },

    mult(a, b) {
        if (b === undefined) {
            b = a
            a = this.lastResult
        } else {
            this.lastResult = 0
            this.clear()
        }
        let res = a * b
        this.lastResult = res
        this.history.push({
            a: a,
            opr: "*", 
            b: b,
            res: this.lastResult
        })
    },

    div(a, b) {
        if (b === undefined){
            b = a
            a = this.lastResult
        } else {
            this.lastResult = 0
            this.clear()
        }
        let res = Math.round(a / b * 100) / 100
        this.lastResult = res
        this.history.push({
            a: a,
            opr: "/", 
            b: b,
            res: this.lastResult
        })
    },

    intDiv(a, b){
        if (b === undefined){
            b = a
            a = this.lastResult
        } else {
            this.lastResult = 0
            this.clear()
        }
        let res = Math.floor(a / b)
        this.lastResult = res
        this.history.push({
            a: a,
            opr: "//", 
            b: b,
            res: this.lastResult
        })
    },

    last() {
        if (this.history.length === 0) {
            return 0
        } else {
            return this.lastResult
        }
    },


    showHistory(){
        if (this.history.length !== 0) {
            let result = "История:\n"
            for (let i = 0; i < this.history.length; i++) {
                let item = this.history[i]
                let string = `${item.a} ${item.opr} ${item.b} = ${item.res}`
                if (i !== this.history.length - 1) {
                    string += "\n"
                }
                result += string
            }
            return result
        } else {
            return "История пуста"
        }

    },

    clear() {
        this.history = []
    },

    undo(){
        if (this.history.length > 1) {
            this.history.pop()
            this.lastResult = this.history.at(-1).res
        } else {
            this.history.pop()
            this.lastResult = 0
        }
    }
}